"use client"

import type React from "react"

import { CurrencyProvider } from "@/contexts/currency-context"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <CurrencyProvider>{children}</CurrencyProvider>
}
