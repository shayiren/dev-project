import type React from "react"

export default function SoldLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen p-8">{children}</div>
}
