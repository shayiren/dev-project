import type React from "react"

// Force dynamic rendering for the entire inventory section
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
