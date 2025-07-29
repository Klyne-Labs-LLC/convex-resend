import { useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

const routeTitles: Record<string, string> = {
  '/dashboard': '📊 Dashboard',
  '/send-email': '📧 Send Email',
  '/email-history': '📂 Email History',
  '/analytics': '📈 Analytics',
  '/settings': '⚙️ Settings',
  '/resources': '📚 Resources',
  '/help': '❓ Help & Support',
}

export function SiteHeader() {
  const location = useLocation()
  const currentTitle = routeTitles[location.pathname] || '📧 Resend Email Testing'

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{currentTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/anthropics/claude-code"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              Built with Claude Code
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
