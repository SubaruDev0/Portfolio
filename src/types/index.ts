export type ProjectCategory = 'frontend' | 'backend' | 'fullstack' | 'research' | 'other';

export interface Project {
  id: string;
  title: string;
  description: string;
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
  description?: string;
  date: string;
  academy: string;
  imageUrl?: string;
  sortOrder?: number;
}

export type ThemeType = 'all' | 'frontend' | 'backend' | 'fullstack' | 'research' | 'other';
