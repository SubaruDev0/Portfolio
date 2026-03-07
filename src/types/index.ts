export type ProjectCategory = 'frontend' | 'backend' | 'fullstack' | 'research' | 'other';
export type Locale = 'es' | 'en' | 'pt' | 'ja';
export type I18nMap = Partial<Record<'en' | 'pt' | 'ja', string>>;

export interface Project {
  id: string;
  title: string;
  titleI18n?: I18nMap;
  description: string;
  descriptionI18n?: I18nMap;
  category: ProjectCategory;
  secondaryCategory?: ProjectCategory | null; // Segunda categoría opcional
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  gallery?: string[];
  featured?: boolean;
  isStarred?: boolean;
  isRealWorld?: boolean;
  sortOrder?: number;
  createdAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  titleI18n?: I18nMap;
  description?: string;
  descriptionI18n?: I18nMap;
  date: string;
  academy: string;
  academyI18n?: I18nMap;
  imageUrl?: string;
  sortOrder?: number;
}

export type ThemeType = 'all' | 'frontend' | 'backend' | 'fullstack' | 'research' | 'other';
