import { useLocation, Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  IconHome,
  IconBooks,
  IconUsers,
  IconCompass,
  IconUser,
  IconSettings,
  IconBook,
  IconHelp,
} from "@tabler/icons-react"

interface RouteInfo {
  title: string;
  icon: React.ReactNode;
  parent?: string;
}

const routeInfo: Record<string, RouteInfo> = {
  '/dashboard': { title: 'Today', icon: <IconHome className="h-4 w-4" /> },
  '/shelves': { title: 'My Shelves', icon: <IconBooks className="h-4 w-4" /> },
  '/circles': { title: 'Reading Circles', icon: <IconUsers className="h-4 w-4" /> },
  '/discover': { title: 'Discover', icon: <IconCompass className="h-4 w-4" /> },
  '/profile': { title: 'Profile', icon: <IconUser className="h-4 w-4" /> },
  '/settings': { title: 'Settings', icon: <IconSettings className="h-4 w-4" /> },
  '/resources': { title: 'Reading Resources', icon: <IconBook className="h-4 w-4" /> },
  '/help': { title: 'Get Help', icon: <IconHelp className="h-4 w-4" /> },
}

export function SiteHeader() {
  const location = useLocation()
  const currentRoute = routeInfo[location.pathname] || { title: 'Leaf Daily', icon: <IconHome className="h-4 w-4" /> }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <IconHome className="h-4 w-4" />
                  Leaf Daily
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {location.pathname !== '/dashboard' && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-2">
                    {currentRoute.icon}
                    {currentRoute.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
