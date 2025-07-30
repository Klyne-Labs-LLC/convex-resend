// Available themes
export const AVAILABLE_THEMES = [
  "perpetuity",
  "bubblegum", 
  "catppuccin",
  "neo-brutalism"
] as const;

export type ThemeName = typeof AVAILABLE_THEMES[number];

// Default theme from environment variable, fallback to perpetuity
export const DEFAULT_THEME: ThemeName = (import.meta.env.VITE_DEFAULT_THEME as ThemeName) || "perpetuity";