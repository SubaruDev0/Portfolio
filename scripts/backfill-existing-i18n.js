require('dotenv').config();
const { Client } = require('pg');

const locales = ['en', 'pt', 'ja'];

const projectTitleI18nById = {
  '1772048010969': {
    en: 'Caserones - Fleet Management and Alerts Platform (Collaboration)',
    pt: 'Caserones - Plataforma de Gestao de Frotas e Alertas (Colaboracao)',
    ja: 'Caserones - 車両管理・アラートプラットフォーム（協業）',
  },
  '1769049109048': {
    en: 'AnimalesPerdidos.cl - Lost Pet Search Platform (2026 Wildfires)',
    pt: 'AnimalesPerdidos.cl - Plataforma de Busca de Pets Perdidos (Incendios Florestais 2026)',
    ja: 'AnimalesPerdidos.cl - 迷子ペット捜索プラットフォーム（2026年森林火災）',
  },
  '1768625935425': {
    en: 'Hector Arias Academy - E-commerce and Educational Academy Platform (Contribution)',
    pt: 'Hector Arias Academy - Plataforma de E-commerce e Academia Educacional (Contribuicao)',
    ja: 'Hector Arias Academy - EC・教育アカデミープラットフォーム（貢献）',
  },
  '1768445649081': {
    en: 'SSR Monitoring Platform - Backend API (For MOP/Ministry of Public Works)',
    pt: 'Plataforma de Monitoramento SSR - API Backend (Para MOP/Ministerio de Obras Publicas)',
    ja: 'SSR監視プラットフォーム - バックエンドAPI（MOP/公共事業省向け）',
  },
  '1768537860891': {
    en: 'Pymemad - Guild Management and Automated Billing Platform (Contribution)',
    pt: 'Pymemad - Plataforma de Gestao Gremial e Faturamento Automatizado (Contribuicao)',
    ja: 'Pymemad - 組合管理・自動請求プラットフォーム（貢献）',
  },
  '1768375347103': {
    en: 'MongooseFeast DEMO',
    pt: 'MongooseFeast DEMO',
    ja: 'MongooseFeast DEMO',
  },
  '1768528900315': {
    en: 'UniHorario - Academic Schedule Optimizer (Web and Desktop)',
    pt: 'UniHorario - Otimizador de Horarios Academicos (Web e Desktop)',
    ja: 'UniHorario - 学業時間割最適化（Web・デスクトップ）',
  },
  '1771963722428': {
    en: 'Paul Ferrada Tattoo | Management and Booking Platform',
    pt: 'Paul Ferrada Tattoo | Plataforma de Gestao e Reservas',
    ja: 'Paul Ferrada Tattoo | 管理・予約プラットフォーム',
  },
  '1768525244085': {
    en: 'Pichangas Manager',
    pt: 'Pichangas Manager',
    ja: 'Pichangas Manager',
  },
  '1768495789774': {
    en: 'Teclafacil Landing Page',
    pt: 'Teclafacil Landing Page',
    ja: 'Teclafacil ランディングページ',
  },
  '1768519403817': {
    en: 'SQL vs NoSQL Comparison',
    pt: 'Comparacao SQL vs NoSQL',
    ja: 'SQL vs NoSQL 比較',
  },
  '1768455901027': {
    en: 'Raspberry Network Metrics',
    pt: 'Raspberry Network Metrics',
    ja: 'Raspberry Network Metrics',
  },
  '1768442078738': {
    en: 'Chilean RUT Validator',
    pt: 'Validador de RUT Chileno',
    ja: 'チリRUT検証ツール',
  },
  '1768523902100': {
    en: 'MiPromedioUSS - Academic Management and Grade Average Calculator',
    pt: 'MiPromedioUSS - Gestao Academica e Calculadora de Medias',
    ja: 'MiPromedioUSS - 学業管理・成績平均計算',
  },
  '1768441149491': {
    en: 'Educational Keylogger - Spyware Analysis',
    pt: 'Keylogger Educacional - Analise de Spyware',
    ja: '教育用キーロガー - スパイウェア解析',
  },
  '1768434451088': {
    en: 'Multi-language Translator for Moodle',
    pt: 'Tradutor Multilingue para Moodle',
    ja: 'Moodle向け多言語翻訳ツール',
  },
  '1768429783739': {
    en: 'Logistics Route Optimizer',
    pt: 'Otimizador de Rota Logistica',
    ja: '物流ルート最適化',
  },
  '1768443794622': {
    en: 'Technical Documentation - Kavosh Algorithm',
    pt: 'Documentacao Tecnica - Algoritmo Kavosh',
    ja: '技術ドキュメント - Kavoshアルゴリズム',
  },
  '1768415938275': {
    en: 'Matrix Sorter v1',
    pt: 'Ordenador de Matrizes v1',
    ja: '行列ソーター v1',
  },
  '1768383663368': {
    en: 'Sales System',
    pt: 'Sistema de Vendas',
    ja: '販売システム',
  },
  '1768376378428': {
    en: 'Climate Analyzer',
    pt: 'Analisador Climatico',
    ja: '気候アナライザー',
  },
  '1768422112266': {
    en: 'Memorize v1',
    pt: 'Memorize v1',
    ja: 'Memorize v1',
  },
  '1768373925463': {
    en: 'Tic Tac Toe (Simple)',
    pt: 'Tic Tac Toe (Simples)',
    ja: 'Tic Tac Toe（シンプル）',
  },
  '1768376957151': {
    en: 'PokeAPI Analysis (Inactive)',
    pt: 'Analise da PokeAPI (Inativa)',
    ja: 'PokeAPI解析（停止中）',
  },
  '1768972273733': {
    en: 'Portfolio - SubaruDev',
    pt: 'Portfolio - SubaruDev',
    ja: 'ポートフォリオ - SubaruDev',
  },
};

const certificateI18nById = {
  '1772051334068': {
    title: {
      en: 'Creator and Developer - AnimalesPerdidos.cl',
      pt: 'Criador e Desenvolvedor - AnimalesPerdidos.cl',
      ja: '開発者・制作者 - AnimalesPerdidos.cl',
    },
    academy: {
      en: '+100 pets reunited',
      pt: '+100 pets reencontrados',
      ja: '100匹以上が再会',
    },
    description: {
      en: 'I led the technical development of the solidarity platform **AnimalesPerdidos.cl**, designed to centralize reports of lost pets during national emergencies. The project became a technological benchmark with high social impact.\n\n### 🏆 Milestones and Recognition:\n* **Press Impact:** Project highlighted and covered by national media such as **Mega, Chilevision (CHV Noticias), Canal 13, TVN, Radio Bio-Bio, and Diario LUN.**\n* **Massive Traffic Handling:** Architecture prepared for high-demand peaks, connecting thousands of families in real time.\n* **Agile Development:** Rapid implementation of a geolocated reporting system, advanced filters, and an optimized database for fast case indexing.\n* **Community Adoption:** More than one hundred reports centralized in the first 48 hours, enabling multiple successful reunions thanks to the viral reach of the tool.',
      pt: 'Liderei o desenvolvimento tecnico da plataforma solidaria **AnimalesPerdidos.cl**, criada para centralizar relatos de pets perdidos durante emergencias nacionais. O projeto tornou-se uma referencia tecnologica com alto impacto social.\n\n### 🏆 Marcos e Reconhecimentos:\n* **Impacto na Midia:** Projeto destacado e coberto por meios nacionais como **Mega, Chilevision (CHV Noticias), Canal 13, TVN, Radio Bio-Bio e Diario LUN.**\n* **Gestao de Trafego Massivo:** Arquitetura preparada para picos de alta demanda, conectando milhares de familias em tempo real.\n* **Desenvolvimento Agil:** Implementacao rapida de um sistema de relatos geolocalizados, filtros avancados e banco de dados otimizado para indexacao rapida de casos.\n* **Adocao Comunitaria:** Mais de uma centena de relatos centralizados nas primeiras 48 horas, gerando multiplos reencontros bem-sucedidos devido ao alcance viral da ferramenta.',
      ja: '私は、全国的な緊急時に迷子ペット情報を一元化するための支援プラットフォーム **AnimalesPerdidos.cl** の技術開発を主導しました。本プロジェクトは、高い社会的インパクトを持つ技術的リファレンスとなりました。\n\n### 🏆 主な成果と評価:\n* **メディアでの反響:** **Mega、Chilevision（CHV Noticias）、Canal 13、TVN、Radio Bio-Bio、Diario LUN** など主要メディアで紹介。\n* **大規模トラフィック対応:** 高負荷ピークに耐えるアーキテクチャを設計し、リアルタイムで数千世帯を接続。\n* **アジャイル開発:** 位置情報付き通報、詳細フィルタ、高速インデックス向け最適化DBを短期間で実装。\n* **コミュニティ導入:** 最初の48時間で100件以上の通報を集約し、ツールの拡散により多数の再会を実現。',
    },
  },
  'uss-titulacion': {
    title: {
      en: 'Computer Engineering Professional',
      pt: 'Engenheiro Civil em Informatica',
      ja: 'コンピュータエンジニア',
    },
    academy: {
      en: 'USS Concepcion',
      pt: 'USS Concepcion',
      ja: 'USS コンセプシオン',
    },
    description: {
      en: 'Professional degree awarded by San Sebastian University, focused on software engineering and technical management.',
      pt: 'Titulo profissional concedido pela Universidade San Sebastian, com foco em engenharia de software e gestao tecnica.',
      ja: 'サン・セバスチャン大学より授与された学位。ソフトウェア工学と技術マネジメントに重点。',
    },
  },
  '1768373274296': {
    title: {
      en: 'Git and GitHub',
      pt: 'Git e GitHub',
      ja: 'Git と GitHub',
    },
    academy: {
      en: 'TodoCode',
      pt: 'TodoCode',
      ja: 'TodoCode',
    },
    description: {
      en: 'Git and GitHub certificate issued by TodoCode.',
      pt: 'Certificado de Git e GitHub emitido por TodoCode.',
      ja: 'TodoCode による Git と GitHub の認定証。',
    },
  },
  '1768376520219': {
    title: {
      en: 'Introduction to Programming Using HTML and CSS',
      pt: 'Introducao a Programacao com HTML e CSS',
      ja: 'HTML と CSS を使ったプログラミング入門',
    },
    academy: {
      en: 'Sololearn',
      pt: 'Sololearn',
      ja: 'Sololearn',
    },
    description: {
      en: 'HTML5 and Cascading Style Sheets (CSS) certificate.',
      pt: 'Certificado de HTML5 e Folhas de Estilo em Cascata (CSS).',
      ja: 'HTML5 と CSS（Cascading Style Sheets）の認定証。',
    },
  },
  'corfo-entrepreneurship': {
    title: {
      en: 'Technology Project Management',
      pt: 'Gestao de Projetos Tecnologicos',
      ja: '技術プロジェクト管理',
    },
    academy: {
      en: 'Corfo / Santander X',
      pt: 'Corfo / Santander X',
      ja: 'Corfo / Santander X',
    },
    description: {
      en: 'Participation in acceleration and commercial validation programs backed by **Corfo** and **Santander X**.',
      pt: 'Participacao em programas de aceleracao e validacao comercial apoiados por **Corfo** e **Santander X**.',
      ja: '**Corfo** と **Santander X** が支援するアクセラレーションおよび商業検証プログラムへの参加。',
    },
  },
};

const cvDescriptionI18n = {
  en: 'Note: This document summarizes my technical and leadership trajectory. Given my versatile profile, I have specific portfolios for Backend/Front and Data Science. I can gladly share more detailed technical information depending on the role.',
  pt: 'Nota: Este documento resume minha trajetoria tecnica e de lideranca. Devido ao meu perfil versatil, disponho de portfolios especificos para Backend/Front e Data Science. Posso compartilhar informacoes tecnicas mais detalhadas de acordo com a vaga.',
  ja: '注記: このドキュメントは私の技術面・リーダーシップ面の経歴を要約したものです。幅広いプロファイルのため、Backend/Front と Data Science の個別ポートフォリオも用意しています。役割に応じて、より詳細な技術情報を共有できます。',
};

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return value;
}

function mergeLocalized(existingMap, fillMap) {
  const out = { ...normalizeMap(existingMap) };
  for (const locale of locales) {
    if (!hasText(out[locale])) {
      out[locale] = (fillMap[locale] || '').trim();
    }
  }
  return out;
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function backfillProjects(client) {
  const result = await client.query(
    'SELECT id, title, description, title_i18n, description_i18n FROM projects ORDER BY sort_order ASC, created_at DESC',
  );

  let updated = 0;
  for (const row of result.rows) {
    const titleFill = projectTitleI18nById[row.id] || {
      en: row.title || '',
      pt: row.title || '',
      ja: row.title || '',
    };

    const baseDescription = row.description || '';
    const descriptionFill = {
      en: baseDescription,
      pt: baseDescription,
      ja: baseDescription,
    };

    const nextTitle = mergeLocalized(row.title_i18n, titleFill);
    const nextDescription = mergeLocalized(row.description_i18n, descriptionFill);

    const changed = !sameJson(normalizeMap(row.title_i18n), nextTitle)
      || !sameJson(normalizeMap(row.description_i18n), nextDescription);

    if (!changed) continue;

    await client.query(
      'UPDATE projects SET title_i18n = $1::jsonb, description_i18n = $2::jsonb WHERE id = $3',
      [JSON.stringify(nextTitle), JSON.stringify(nextDescription), row.id],
    );
    updated += 1;
  }

  return { total: result.rows.length, updated };
}

async function backfillCertificates(client) {
  const result = await client.query(
    'SELECT id, title, academy, description, title_i18n, academy_i18n, description_i18n FROM certificates ORDER BY sort_order ASC, date DESC',
  );

  let updated = 0;
  for (const row of result.rows) {
    const mapped = certificateI18nById[row.id] || {};

    const titleFill = mapped.title || {
      en: row.title || '',
      pt: row.title || '',
      ja: row.title || '',
    };

    const academyFill = mapped.academy || {
      en: row.academy || '',
      pt: row.academy || '',
      ja: row.academy || '',
    };

    const descriptionFill = mapped.description || {
      en: row.description || '',
      pt: row.description || '',
      ja: row.description || '',
    };

    const nextTitle = mergeLocalized(row.title_i18n, titleFill);
    const nextAcademy = mergeLocalized(row.academy_i18n, academyFill);
    const nextDescription = mergeLocalized(row.description_i18n, descriptionFill);

    const changed = !sameJson(normalizeMap(row.title_i18n), nextTitle)
      || !sameJson(normalizeMap(row.academy_i18n), nextAcademy)
      || !sameJson(normalizeMap(row.description_i18n), nextDescription);

    if (!changed) continue;

    await client.query(
      'UPDATE certificates SET title_i18n = $1::jsonb, academy_i18n = $2::jsonb, description_i18n = $3::jsonb WHERE id = $4',
      [JSON.stringify(nextTitle), JSON.stringify(nextAcademy), JSON.stringify(nextDescription), row.id],
    );
    updated += 1;
  }

  return { total: result.rows.length, updated };
}

async function backfillCvDescription(client) {
  const existing = await client.query(
    "SELECT key, value FROM portfolio_settings WHERE key IN ('cv_description_en', 'cv_description_pt', 'cv_description_ja')",
  );

  const map = {};
  for (const row of existing.rows) {
    map[row.key] = row.value;
  }

  let updated = 0;
  for (const locale of locales) {
    const key = `cv_description_${locale}`;
    if (hasText(map[key])) continue;

    const value = cvDescriptionI18n[locale];
    await client.query(
      `INSERT INTO portfolio_settings (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [key, value],
    );
    updated += 1;
  }

  return { total: locales.length, updated };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query('BEGIN');

    await client.query("ALTER TABLE projects ADD COLUMN IF NOT EXISTS title_i18n JSONB DEFAULT '{}'::jsonb");
    await client.query("ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}'::jsonb");
    await client.query("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS title_i18n JSONB DEFAULT '{}'::jsonb");
    await client.query("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}'::jsonb");
    await client.query("ALTER TABLE certificates ADD COLUMN IF NOT EXISTS academy_i18n JSONB DEFAULT '{}'::jsonb");

    const projects = await backfillProjects(client);
    const certificates = await backfillCertificates(client);
    const cvDescriptions = await backfillCvDescription(client);

    await client.query('COMMIT');

    console.log('Backfill completed successfully.');
    console.table([
      { entity: 'projects', total: projects.total, updated: projects.updated },
      { entity: 'certificates', total: certificates.total, updated: certificates.updated },
      { entity: 'cv_descriptions', total: cvDescriptions.total, updated: cvDescriptions.updated },
    ]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});
