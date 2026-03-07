require('dotenv').config();
const { Client } = require('pg');

const SOURCE_LOCALE = 'es';
const TARGET_LOCALES = ['en', 'pt', 'ja'];
const TRANSLATE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return { ...value };
}

function sameText(a, b) {
  return (a || '').trim() === (b || '').trim();
}

function extractTranslatedText(payload) {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    return '';
  }
  return payload[0]
    .map((entry) => (Array.isArray(entry) ? (entry[0] || '') : ''))
    .join('');
}

async function translateChunk(text, targetLocale) {
  if (!hasText(text)) return text;

  const url = `${TRANSLATE_ENDPOINT}?client=gtx&sl=${SOURCE_LOCALE}&tl=${targetLocale}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Translate request failed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const translated = extractTranslatedText(payload);
  return hasText(translated) ? translated : text;
}

function splitMarkdownIntoBlocks(markdown) {
  const tokens = markdown.split(/(\n{2,})/);
  return tokens.filter((token) => token.length > 0);
}

function protectCodeBlocks(markdown) {
  const codeTokens = [];
  let counter = 0;

  const withProtectedFences = markdown.replace(/```[\s\S]*?```/g, (match) => {
    const key = `__CODE_BLOCK_${counter++}__`;
    codeTokens.push({ key, value: match });
    return key;
  });

  const withProtectedInline = withProtectedFences.replace(/`[^`\n]+`/g, (match) => {
    const key = `__INLINE_CODE_${counter++}__`;
    codeTokens.push({ key, value: match });
    return key;
  });

  return { text: withProtectedInline, codeTokens };
}

function restoreCodeBlocks(text, codeTokens) {
  return codeTokens.reduce((acc, token) => acc.split(token.key).join(token.value), text);
}

async function translateMarkdown(markdown, targetLocale) {
  if (!hasText(markdown)) return markdown;

  const { text: protectedText, codeTokens } = protectCodeBlocks(markdown);
  const blocks = splitMarkdownIntoBlocks(protectedText);

  const translatedBlocks = [];
  for (const block of blocks) {
    if (/^\n+$/.test(block) || !hasText(block)) {
      translatedBlocks.push(block);
      continue;
    }

    const translated = await translateChunk(block, targetLocale);
    translatedBlocks.push(translated);
    await sleep(110);
  }

  return restoreCodeBlocks(translatedBlocks.join(''), codeTokens);
}

async function ensureI18nColumns(client) {
  await client.query("ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}'::jsonb");
  await client.query("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}'::jsonb");
}

async function translateProjectDescriptions(client) {
  const result = await client.query(
    'SELECT id, title, description, description_i18n FROM projects ORDER BY sort_order ASC, created_at DESC',
  );

  let updatedRows = 0;
  let translatedLocales = 0;

  for (let index = 0; index < result.rows.length; index += 1) {
    const row = result.rows[index];
    const baseDescription = row.description || '';

    if (!hasText(baseDescription)) {
      continue;
    }

    const nextMap = normalizeMap(row.description_i18n);
    let changed = false;

    for (const locale of TARGET_LOCALES) {
      const existing = nextMap[locale];
      const shouldTranslate = !hasText(existing) || sameText(existing, baseDescription);

      if (!shouldTranslate) {
        continue;
      }

      const translated = await translateMarkdown(baseDescription, locale);
      if (!hasText(translated)) {
        continue;
      }

      nextMap[locale] = translated;
      translatedLocales += 1;
      changed = true;

      console.log(`[projects] ${index + 1}/${result.rows.length} ${row.id} -> ${locale}`);
    }

    if (!changed) {
      continue;
    }

    await client.query(
      'UPDATE projects SET description_i18n = $1::jsonb WHERE id = $2',
      [JSON.stringify(nextMap), row.id],
    );

    updatedRows += 1;
  }

  return {
    totalRows: result.rows.length,
    updatedRows,
    translatedLocales,
  };
}

async function translateCertificateDescriptions(client) {
  const result = await client.query(
    'SELECT id, title, description, description_i18n FROM certificates ORDER BY sort_order ASC, date DESC',
  );

  let updatedRows = 0;
  let translatedLocales = 0;

  for (let index = 0; index < result.rows.length; index += 1) {
    const row = result.rows[index];
    const baseDescription = row.description || '';

    if (!hasText(baseDescription)) {
      continue;
    }

    const nextMap = normalizeMap(row.description_i18n);
    let changed = false;

    for (const locale of TARGET_LOCALES) {
      const existing = nextMap[locale];
      const shouldTranslate = !hasText(existing) || sameText(existing, baseDescription);

      if (!shouldTranslate) {
        continue;
      }

      const translated = await translateMarkdown(baseDescription, locale);
      if (!hasText(translated)) {
        continue;
      }

      nextMap[locale] = translated;
      translatedLocales += 1;
      changed = true;

      console.log(`[certificates] ${index + 1}/${result.rows.length} ${row.id} -> ${locale}`);
    }

    if (!changed) {
      continue;
    }

    await client.query(
      'UPDATE certificates SET description_i18n = $1::jsonb WHERE id = $2',
      [JSON.stringify(nextMap), row.id],
    );

    updatedRows += 1;
  }

  return {
    totalRows: result.rows.length,
    updatedRows,
    translatedLocales,
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query('BEGIN');
    await ensureI18nColumns(client);

    const projects = await translateProjectDescriptions(client);
    const certificates = await translateCertificateDescriptions(client);

    await client.query('COMMIT');

    console.log('Markdown translation completed successfully.');
    console.table([
      {
        entity: 'projects_descriptions',
        totalRows: projects.totalRows,
        updatedRows: projects.updatedRows,
        translatedLocales: projects.translatedLocales,
      },
      {
        entity: 'certificates_descriptions',
        totalRows: certificates.totalRows,
        updatedRows: certificates.updatedRows,
        translatedLocales: certificates.translatedLocales,
      },
    ]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Markdown translation failed:', error);
  process.exit(1);
});
