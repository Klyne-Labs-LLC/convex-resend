import React, { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { themes } from "@/themes";
import { useThemeLoader } from "@/hooks/use-theme-loader";

export default function SettingsPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || (themes[0]?.name ?? ""));

  useThemeLoader(theme);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Card>
      <CardTitle>Theme</CardTitle>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {themes.map((t) => (
            <Button
              key={t.name}
              variant={theme === t.name ? "default" : "outline"}
              onClick={() => setTheme(t.name)}
            >
              {t.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}