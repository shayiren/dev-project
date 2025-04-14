"use client"

import type React from "react"

import { CurrencyProvider } from "@/components/currency-provider"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <CurrencyProvider>{children}</CurrencyProvider>
}
