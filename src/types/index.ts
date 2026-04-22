// ============================================
// Core Types
// ============================================

export type UserRole = "USER" | "ADMIN";

export type SubscriptionStatus =
  | "INCOMPLETE"
  | "INCOMPLETE_EXPIRED"
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "UNPAID"
  | "PAUSED";

export type SubscriptionTier = "FREE" | "PRO" | "STUDIO";

export type GenerationStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type BodyPlacement =
  | "ARM"
  | "FOREARM"
  | "WRIST"
  | "HAND"
  | "CHEST"
  | "BACK"
  | "SHOULDER"
  | "LEG"
  | "THIGH"
  | "CALF"
  | "ANKLE"
  | "FOOT"
  | "NECK"
  | "RIBCAGE"
  | "OTHER";

export type AspectRatio = "SQUARE" | "PORTRAIT" | "LANDSCAPE" | "WIDE";

export type CreditTransactionType =
  | "PURCHASE"
  | "SUBSCRIPTION_GRANT"
  | "GENERATION_USE"
  | "BONUS"
  | "REFUND"
  | "ADMIN_ADJUSTMENT";

export type UploadType = "REFERENCE" | "BODY_PHOTO";

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// Feature Flag Types
// ============================================

export interface FeatureFlags {
  aiGeneration: boolean;
  tryOn: boolean;
  gallery: boolean;
  payments: boolean;
}

// ============================================
// Navigation Types
// ============================================

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavItem[];
}

// ============================================
// Component Prop Types
// ============================================

// ChildrenProps removed - use React.PropsWithChildren instead

export interface ClassNameProps {
  className?: string;
}
