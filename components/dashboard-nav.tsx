"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  Package,
  Settings,
  Users,
  Building,
  Tag,
  History,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
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
      title: "Properties",
      href: "/dashboard/properties",
      icon: <Building className="mr-2 h-4 w-4" />,
    },
    {
      title: "Sold Units",
      href: "/dashboard/sold",
      icon: <Tag className="mr-2 h-4 w-4" />,
    },
    {
      title: "Development",
      href: "/dashboard/development",
      icon: <Package className="mr-2 h-4 w-4" />,
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      title: "Sales Offers",
      href: "/dashboard/sales-offers",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Price Management",
      href: "/dashboard/price-management",
      icon: <Tag className="mr-2 h-4 w-4" />,
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
    {
      title: "Logs",
      href: "/dashboard/logs",
      icon: <History className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-muted")}>
            {item.icon}
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}
