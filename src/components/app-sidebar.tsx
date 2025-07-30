import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconMail,
  IconMailOpened,
  IconSettings,
  IconBook,
} from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { useConvexAuth, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Send Email",
      url: "/send-email",
      icon: IconMail,
    },
    {
      title: "Email History",
      url: "/email-history",
      icon: IconMailOpened,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Resources",
      url: "/resources",
      icon: IconBook,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSection?: string;
}

export function AppSidebar({ activeSection: _activeSection = "dashboard", ...props }: AppSidebarProps) {
  const { isAuthenticated } = useConvexAuth()
  const currentUser = useQuery(api.auth.currentUser)
  
  // Get user data from auth context or fallback to placeholder
  const userData = React.useMemo(() => {
    if (isAuthenticated && currentUser) {
      return {
        name: currentUser.name || "User",
        email: currentUser.email || "user@example.com",
        avatar: `/avatars/${currentUser.name?.charAt(0).toLowerCase() || 'u'}.jpg`,
      }
    }
    return {
      name: "Email User",
      email: "user@resend.dev", 
      avatar: "/avatars/user.jpg",
    }
  }, [isAuthenticated, currentUser])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/dashboard">
                <IconMail className="!size-5" />
                <span className="text-base font-semibold">Klyne Labs - Pulse</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}