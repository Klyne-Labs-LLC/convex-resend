import { useEffect } from "react";

export function useThemeLoader(theme: string) {
  useEffect(() => {
    if (!theme) return;
    // Remove any previous theme
    const prev = document.getElementById("theme-css");
    if (prev) prev.remove();

    // Add new theme
    const link = document.createElement("link");
    link.id = "theme-css";
    link.rel = "stylesheet";
    link.href = `/src/themes/${theme}.css`;
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [theme]);
}