/**
 * Shared domain types (client + server).
 * Mirrors `app-repo-mockup/src/types.ts` and the Firestore data model in `docs/data-model.md`.
 */

export type PricingType = "FREE" | "PAID" | "SUBSCRIPTION" | "FREEMIUM";

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  pricingType: PricingType;
  category: string;
  tags: string[];
  ownerId: string;
  ownerName: string;
  starsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Star {
  id: string; // "userId_toolId"
  userId: string;
  toolId: string;
  createdAt: string;
}

/** Categories accepted by the filters/form, from the mockup. */
export const CATEGORIES = [
  "Development",
  "Design",
  "Database",
  "Hosting",
  "Management",
  "Tools",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Sort options for the tool list (mockup: popularity vs creation date). */
export type SortBy = "stars" | "newest";

/**
 * Top-level page state machine (mockup semantics).
 * Used by AppHeader navigation and the page shell.
 */
export type PageId =
  | "discover"
  | "bookmarks"
  | "my-tools"
  | "add-tool"
  | "login"
  | "register";

/** Form payload emitted by ToolForm (create/update). */
export interface ToolInput {
  name: string;
  description: string;
  url: string;
  pricingType: PricingType;
  category: string;
  tags: string[];
}