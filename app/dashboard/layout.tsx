import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <div className="hidden border-r md:block w-64">
          <div className="flex h-full flex-col py-4">
            <DashboardNav />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b px-4">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </header>
          <main className="flex-1 p-4 overflow-auto">
            {/* Added a wrapper div to ensure children are rendered */}
            <div>{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
