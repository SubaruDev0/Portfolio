export type ThemeKey = 'all' | 'frontend' | 'backend' | 'fullstack' | 'research' | 'other';

export interface Dictionary {
  language: {
    label: string;
    switching: string;
    es: string;
    en: string;
    pt: string;
    ja: string;
  };
  navbar: {
    home: string;
    projects: string;
    about: string;
    certificates: string;
    contact: string;
    downloadCv: string;
    cvShort: string;
  };
  themeSwitch: Record<ThemeKey, string>;
  hero: {
    badgeByTheme: Record<ThemeKey, string>;
    descriptionByTheme: Record<ThemeKey, string>;
    profession: string;
    viewProjects: string;
    downloadCv: string;
  };
  filters: {
    clear: string;
    title: string;
    showing: string;
    project: string;
    projects: string;
    totalCollection: string;
    seeLess: string;
    seeMore: string;
    searchPlaceholder: string;
    noMatches: string;
    featured: string;
    production: string;
  };
  projects: {
    noResultsTitleDefault: string;
    noResultsTitleFullstack: string;
    noResultsDescriptionDefault: string;
    noResultsDescriptionFullstack: string;
    seeMoreProjects: string;
    seeLessProjects: string;
  };
  about: {
    titleStart: string;
    titleHighlight: string;
    introPrefix: string;
    name: string;
    paragraph1: string;
    paragraph2: string;
    techNoteTitle: string;
    techNoteText: string;
    residenceValue: string;
    residenceLabel: string;
    degreeValue: string;
    degreeLabel: string;
    universityName: string;
    universityCampus: string;
    universityDescription: string;
    featureTeamwork: string;
    featureEnglish: string;
    featureLeadership: string;
    featureCorfo: string;
  };
  certificates: {
    sectionTitle: string;
    sectionTitleSecondary: string;
  };
  contactSection: {
    tag: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine3: string;
    description: string;
    sendEmail: string;
    whatsapp: string;
  };
  footer: {
    copyright: string;
  };
  projectCard: {
    categories: {
      frontend: string;
      backend: string;
      fullstack: string;
      research: string;
      other: string;
    };
    productionBadge: string;
    productionTooltipTitle: string;
    productionTooltipText: string;
  };
  projectModal: {
    categories: {
      frontend: string;
      backend: string;
      fullstack: string;
      research: string;
      other: string;
    };
    productionBadge: string;
    productionTooltipTitle: string;
    productionTooltipText: string;
    featured: string;
    stackTitle: string;
    liveDemo: string;
    sourceCode: string;
    aboutProject: string;
    readMore: string;
    readLess: string;
  };
  certificateCard: {
    defaultDescription: string;
  };
  certificateModal: {
    defaultDescription: string;
    viewFullImage: string;
    downloadFile: string;
  };
  cvModal: {
    previewTitle: string;
    noPreview: string;
    titleStart: string;
    titleHighlight: string;
    defaultDescription: string;
    directContact: string;
    gmail: string;
    whatsapp: string;
    downloadPdf: string;
    fullscreenPreview: string;
  };
  contactModal: {
    title: string;
    sent: string;
    error: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    optional: string;
    subjectLabel: string;
    messageLabel: string;
    required: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    sending: string;
    send: string;
  };
}
