import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
        Overview
      </Link>
      <Link
        href="/dashboard/inventory"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Inventory
      </Link>
      <Link
        href="/dashboard/price-management"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Price Management
      </Link>
      <Link
        href="/dashboard/sales"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Sales
      </Link>
      <Link
        href="/dashboard/reservations"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Reservations
      </Link>
      <Link
        href="/dashboard/agencies"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Agencies
      </Link>
      <Link
        href="/dashboard/reports"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Reports
      </Link>
      <Link
        href="/dashboard/users"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Users
      </Link>
    </nav>
  )
}
