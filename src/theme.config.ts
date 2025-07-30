// Auto-discover all CSS theme files (same as themes/index.ts but for config)
const themeFiles = import.meta.glob('./themes/*.css', { query: '?url', import: 'default' });

// Extract theme names from file paths
export const AVAILABLE_THEMES = Object.keys(themeFiles).map(path => 
  path.replace('./themes/', '').replace('.css', '')
);

export type ThemeName = string;

// Default theme from environment variable, fallback to perpetuity
export const DEFAULT_THEME: string = import.meta.env.VITE_DEFAULT_THEME || "perpetuity";