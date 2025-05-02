"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Building,
  Building2,
  Calendar,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Users,
  DollarSign,
  Tag,
  Folder,
} from "lucide-react"

interface NavProps {
  isCollapsed: boolean
}

export function DashboardNav({ isCollapsed }: NavProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      title: "Dashboard",
    },
    {
      href: "/dashboard/properties",
      icon: Building,
      title: "Properties",
    },
    {
      href: "/dashboard/sold",
      icon: Tag,
      title: "Sold Units",
    },
    {
      href: "/dashboard/development",
      icon: Building2,
      title: "Development",
    },
    {
      href: "/dashboard/clients",
      icon: Users,
      title: "Clients",
    },
    {
      href: "/dashboard/sales-offers",
      icon: FileText,
      title: "Sales Offers",
    },
    {
      href: "/dashboard/price-management",
      icon: DollarSign,
      title: "Price Management",
    },
    {
      href: "/dashboard/documents",
      icon: Folder,
      title: "Documents",
    },
    {
      href: "/dashboard/analytics",
      icon: BarChart3,
      title: "Analytics",
    },
    {
      href: "/dashboard/calendar",
      icon: Calendar,
      title: "Calendar",
    },
    {
      href: "/dashboard/messages",
      icon: MessageSquare,
      title: "Messages",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      title: "Settings",
    },
  ]

  return (
    <nav className="grid items-start gap-2 px-2 text-sm font-medium">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === route.href && "bg-muted text-primary",
            isCollapsed && "justify-center",
          )}
        >
          <route.icon className="h-4 w-4" />
          {!isCollapsed && <span>{route.title}</span>}
        </Link>
      ))}
    </nav>
  )
}
