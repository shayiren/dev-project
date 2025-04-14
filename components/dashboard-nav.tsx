"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Building,
  Users,
  BarChart3,
  Settings,
  FileText,
  Home,
  Layers,
  Plus,
  Download,
  MessageSquare,
  Calendar,
  CheckCircle,
  UserCog,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: NavItem[]
}

export function DashboardNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: "Development",
      href: "/dashboard/development",
      icon: <Building className="mr-2 h-4 w-4" />,
      submenu: [
        {
          title: "All Units",
          href: "/dashboard/development",
          icon: <Building className="mr-2 h-4 w-4" />,
        },
        {
          title: "Add Unit",
          href: "/dashboard/properties/add",
          icon: <Plus className="mr-2 h-4 w-4" />,
        },
        {
          title: "Import Units",
          href: "/dashboard/properties/import",
          icon: <Download className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "Sales Offers",
      href: "/dashboard/sales-offers",
      icon: <FileText className="mr-2 h-4 w-4" />,
      submenu: [
        {
          title: "Generate Offers",
          href: "/dashboard/sales-offers",
          icon: <FileText className="mr-2 h-4 w-4" />,
        },
        {
          title: "Payment Plans",
          href: "/dashboard/sales-offers/payment-plans",
          icon: <FileText className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "Sold Units",
      href: "/dashboard/sold",
      icon: <CheckCircle className="mr-2 h-4 w-4" />,
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: <Users className="mr-2 h-4 w-4" />,
      submenu: [
        {
          title: "All Clients",
          href: "/dashboard/clients",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          title: "Add Client",
          href: "/dashboard/clients/add",
          icon: <Plus className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "User Management",
      href: "/dashboard/users",
      icon: <UserCog className="mr-2 h-4 w-4" />,
      submenu: [
        {
          title: "All Users",
          href: "/dashboard/users",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          title: "Add User",
          href: "/dashboard/users/add",
          icon: <Plus className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      submenu: [
        {
          title: "Project Management",
          href: "/dashboard/settings/projects",
          icon: <Layers className="mr-2 h-4 w-4" />,
        },
        {
          title: "Developer Management",
          href: "/dashboard/settings/developers",
          icon: <Building className="mr-2 h-4 w-4" />,
        },
      ],
    },
  ]

  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item) => {
      const isActive = pathname === item.href
      const hasSubmenu = item.submenu && item.submenu.length > 0
      const isSubmenuActive =
        hasSubmenu &&
        item.submenu?.some(
          (subItem) =>
            pathname === subItem.href ||
            (subItem.submenu && subItem.submenu.some((subSubItem) => pathname === subSubItem.href)),
        )

      return (
        <div key={item.href} className={cn("my-1", level > 0 && "ml-4")}>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn("w-full justify-start font-normal", isActive && "font-medium")}
            asChild
          >
            <Link href={item.href}>
              {item.icon}
              {item.title}
            </Link>
          </Button>

          {hasSubmenu && isSubmenuActive && <div className="mt-1">{renderNavItems(item.submenu!, level + 1)}</div>}
        </div>
      )
    })
  }

  return (
    <div className="py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">RealEstateHub</h2>
        <div className="space-y-1">{renderNavItems(navItems)}</div>
      </div>
    </div>
  )
}
