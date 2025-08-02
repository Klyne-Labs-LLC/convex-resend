import * as React from "react"
import {
  IconHelp,
  IconSettings,
  IconBook,
  IconBook2,
  IconBooks,
  IconUsers,
  IconCompass,
  IconUser,
  IconHome,
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
      title: "Today",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "My Shelves",
      url: "/shelves",
      icon: IconBooks,
    },
    {
      title: "Reading Circles",
      url: "/circles",
      icon: IconUsers,
    },
    {
      title: "Discover",
      url: "/discover",
      icon: IconCompass,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: IconUser,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Reading Resources",
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
                <IconBook2 className="!size-5" />
                <span className="text-base font-semibold">Leaf Daily</span>
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