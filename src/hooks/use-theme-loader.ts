import { useEffect } from "react";
import { DEFAULT_THEME } from "../theme.config";
import { themes } from "../themes";

export function useThemeLoader(theme: string) {
  useEffect(() => {
    const selectedTheme = theme || DEFAULT_THEME;
    
    // Find the theme URL from the auto-discovered themes
    const themeData = themes.find(t => t.name === selectedTheme);
    if (!themeData) {
      console.warn(`Theme "${selectedTheme}" not found. Available themes:`, themes.map(t => t.name));
      return;
    }
    
    // Remove any previous dynamically loaded theme
    const prev = document.getElementById("theme-css");
    if (prev) prev.remove();

    // Load the theme using the correct bundled URL (handle Promise)
    const loadTheme = async () => {
      const url = await themeData.getUrl() as string;
      const link = document.createElement("link");
      link.id = "theme-css";
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    };
    
    loadTheme();

    // Also apply theme class to html element for better scoping
    document.documentElement.setAttribute('data-theme', selectedTheme);

    return () => {
      const linkToRemove = document.getElementById("theme-css");
      if (linkToRemove) linkToRemove.remove();
    };
  }, [theme]);
}