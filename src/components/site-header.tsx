import { useLocation } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconMail,
  IconMailOpened,
  IconSettings,
  IconBook,
} from "@tabler/icons-react"

interface RouteTitle {
  title: string;
  icon: React.ReactNode;
}

const routeTitles: Record<string, RouteTitle> = {
  '/dashboard': { title: 'Dashboard', icon: <IconDashboard className="h-4 w-4 mr-2" /> },
  '/send-email': { title: 'Send Email', icon: <IconMail className="h-4 w-4 mr-2" /> },
  '/email-history': { title: 'Email History', icon: <IconMailOpened className="h-4 w-4 mr-2" /> },
  '/analytics': { title: 'Analytics', icon: <IconChartBar className="h-4 w-4 mr-2" /> },
  '/settings': { title: 'Settings', icon: <IconSettings className="h-4 w-4 mr-2" /> },
  '/resources': { title: 'Resources', icon: <IconBook className="h-4 w-4 mr-2" /> },
  '/help': { title: 'Get Help', icon: <IconHelp className="h-4 w-4 mr-2" /> },
}

export function SiteHeader() {
  const location = useLocation()
  const currentRoute = routeTitles[location.pathname] || { title: 'Resend Email Testing', icon: <IconMail className="h-4 w-4 mr-2" /> }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium flex items-center">
          {currentRoute.icon}
          {currentRoute.title}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
