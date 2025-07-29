import { IconMoon, IconSun } from "@tabler/icons-react"
import { Toggle } from "@/components/ui/toggle"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Toggle 
      pressed={isDark}
      onPressedChange={toggleTheme}
      aria-label="Toggle theme"
      size="sm"
    >
      <IconSun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <IconMoon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Toggle>
  )
}