import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <div className="hidden border-r md:block">
          <div className="flex h-full flex-col">
            <DashboardNav />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b px-4">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
