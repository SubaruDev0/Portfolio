require('dotenv').config();
const { Client } = require('pg');

function hasText(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function applyReplacements(text, replacements) {
  if (!hasText(text)) return text;
  let out = text;
  for (const [from, to] of replacements) {
    out = out.split(from).join(to);
  }
  return out;
}

const enReplacements = [
  ['Computer Civil Engineer', 'Computer Engineer'],
  ['# Cat Game (Tic-Tac-Toe)', '# Tic-Tac-Toe'],
  ['simple Cat game', 'simple Tic-Tac-Toe game'],
  ['The Cat game is a two-player game', 'Tic-Tac-Toe is a two-player game'],
  ['## ⚙ **How ​​It Works**', '## ⚙ **How It Works**'],
];

const ptReplacements = [
  ['**Folheto**', '**Leaflet**'],
  ['Experimente a inscrição on-line aqui', 'Experimente a aplicacao online aqui'],
  ['jogo Cat', 'jogo da velha'],
  ['O jogo Cat e um jogo para dois jogadores', 'O jogo da velha e um jogo para dois jogadores'],
  ['sem necessidade de reimplementacao', 'sem necessidade de redeploy'],
  ['Engenheiro Civil da Computacao', 'Engenheiro de Computacao'],
];

const jaReplacements = [
  ['コンピュータ土木技術者', '情報工学エンジニア'],
  ['資格情報をテストする', 'テスト用認証情報'],
  ['サン セバスティアン大学', 'サン・セバスチャン大学'],
  ['花束の収集', '時間割作成'],
  ['# いたちごっこ（三目並べ）', '# 三目並べ（Tic-Tac-Toe）'],
  ['単純な Cat ゲーム', 'シンプルな Tic-Tac-Toe ゲーム'],
  ['Cat ゲームは 2 人用のゲーム', 'Tic-Tac-Toe は2人で遊ぶゲーム'],
  ['＃＃ ', '## '],
  ['「」バッシュ', '```bash'],
  ['こちらからオンライン申請をお試しください', 'こちらからオンライン版を試せます'],
  ['すべてのカードが一致すると、「勝ちました」というメッセージが表示されます。', 'すべてのカードを揃えると「You have won」と表示されます。'],
  ['再デプロイする必要はありません。', '再デプロイ不要で運用できます。'],
];

const projectSpecificJaReplacements = {
  '1768528900315': [
    ['**サン・セバスチャン大学**の学生向けに設計された**学業スケジュール最適化** ツールです。', '**サン・セバスチャン大学**の学生向けに設計された**時間割最適化ツール**です。'],
    ['USS ポータルからの実際のデータに基づいて、個人の好みに応じて最適な組み合わせを生成することで、時間割作成を自動化します。', 'USSポータルの実データをもとに、希望条件に合わせた最適な時間割候補を自動生成します。'],
  ],
  '1768422112266': [
    ['それは、ゲームボード上に隠された同一のカードのペアをすべて見つけることで構成されます。', 'ゲームボード上に隠された同じ数字のペアをすべて見つけるメモリーゲームです。'],
  ],
};

function normalizeMap(map) {
  if (!map || typeof map !== 'object' || Array.isArray(map)) return {};
  return { ...map };
}

function jsonEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function polishMap(map, rowId, isProject) {
  const next = normalizeMap(map);

  if (hasText(next.en)) next.en = applyReplacements(next.en, enReplacements);
  if (hasText(next.pt)) next.pt = applyReplacements(next.pt, ptReplacements);
  if (hasText(next.ja)) {
    next.ja = applyReplacements(next.ja, jaReplacements);
    if (isProject && projectSpecificJaReplacements[rowId]) {
      next.ja = applyReplacements(next.ja, projectSpecificJaReplacements[rowId]);
    }
  }

  return next;
}

async function polishProjects(client) {
  const rows = await client.query('SELECT id, description_i18n FROM projects');
  let updated = 0;

  for (const row of rows.rows) {
    const current = normalizeMap(row.description_i18n);
    const next = polishMap(current, row.id, true);

    if (jsonEqual(current, next)) continue;

    await client.query('UPDATE projects SET description_i18n = $1::jsonb WHERE id = $2', [
      JSON.stringify(next),
      row.id,
    ]);
    updated += 1;
  }

  return { total: rows.rows.length, updated };
}

async function polishCertificates(client) {
  const rows = await client.query('SELECT id, description_i18n FROM certificates');
  let updated = 0;

  for (const row of rows.rows) {
    const current = normalizeMap(row.description_i18n);
    const next = polishMap(current, row.id, false);

    if (jsonEqual(current, next)) continue;

    await client.query('UPDATE certificates SET description_i18n = $1::jsonb WHERE id = $2', [
      JSON.stringify(next),
      row.id,
    ]);
    updated += 1;
  }

  return { total: rows.rows.length, updated };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query('BEGIN');
    const projectStats = await polishProjects(client);
    const certStats = await polishCertificates(client);
    await client.query('COMMIT');

    console.log('Polish completed successfully.');
    console.table([
      { entity: 'projects.description_i18n', total: projectStats.total, updated: projectStats.updated },
      { entity: 'certificates.description_i18n', total: certStats.total, updated: certStats.updated },
    ]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Polish failed:', error);
  process.exit(1);
});
