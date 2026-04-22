export type FilterType =
  | "style"
  | "placement"
  | "category"
  | "meaning"
  | "audience";

export interface Tattoo {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  style: string;
  placement?: string;
  category: string;
  meanings: string[];
  audience: string;
  tags: string[];
  artistName?: string;
  artistUrl?: string;
  viewCount: number;
  likeCount: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface GalleryFilter {
  type: FilterType;
  slug: string;
  label: string;
  count: number;
}

export interface FilterState {
  style?: string;
  placement?: string;
  category?: string;
  meaning?: string;
  audience?: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface FilterConfig {
  type: FilterType;
  label: string;
  options: FilterOption[];
}

export interface ParsedPath {
  segments: { type: FilterType; slug: string }[];
  isValid: boolean;
}

export interface GalleryPageData {
  tattoos: Tattoo[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: FilterState;
  filterConfigs: FilterConfig[];
  relatedFilters: GalleryFilter[];
  title: string;
  description: string;
}
