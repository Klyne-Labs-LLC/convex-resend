import { useEffect } from "react";
import { DEFAULT_THEME } from "../theme.config";

export function useThemeLoader(theme: string) {
  useEffect(() => {
    const selectedTheme = theme || DEFAULT_THEME;
    
    // Remove any previous dynamically loaded theme
    const prev = document.getElementById("theme-css");
    if (prev) prev.remove();

    // Always load the selected theme to ensure proper overriding
    const link = document.createElement("link");
    link.id = "theme-css";
    link.rel = "stylesheet";
    link.href = `/src/themes/${selectedTheme}.css`;
    document.head.appendChild(link);

    return () => {
      const linkToRemove = document.getElementById("theme-css");
      if (linkToRemove) linkToRemove.remove();
    };
  }, [theme]);
}