import type { Tool, User } from "#shared/types";

/** Reference users matching the mockup/results for deterministic tests. */
export const mario: User = {
  uid: "mario_rossi",
  email: "mario.rossi@example.com",
  name: "Mario Rossi",
  avatarUrl: null,
  createdAt: "2026-01-15T10:00:00Z",
};

/** A tool owned by `mario`. */
export const marioTool: Tool = {
  id: "figma",
  name: "Figma",
  description:
    "A powerful vector graphics editor and prototyping tool which is primarily web-based, with additional offline features.",
  url: "https://figma.com",
  pricingType: "FREEMIUM",
  category: "Design",
  tags: ["UI/UX", "Collaborative", "Vector"],
  ownerId: "mario_rossi",
  ownerName: "Mario Rossi",
  starsCount: 142,
  createdAt: "2026-01-20T10:00:00Z",
  updatedAt: "2026-01-20T10:00:00Z",
};

/** A tool owned by someone else (e.g. to test owner-conditional actions). */
export const otherTool: Tool = {
  ...marioTool,
  id: "vscode",
  name: "Visual Studio Code",
  description:
    "A lightweight but powerful source code editor which runs on your desktop and is available for Windows, macOS and Linux.",
  url: "https://code.visualstudio.com",
  pricingType: "FREE",
  category: "Development",
  ownerId: "jane_doe",
  ownerName: "Jane Doe",
  starsCount: 289,
  createdAt: "2026-02-15T11:20:00Z",
  updatedAt: "2026-02-15T11:20:00Z",
};