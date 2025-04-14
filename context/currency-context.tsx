"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type CurrencyContextType = {
  currency: string
  setCurrency: (currency: string) => void
  formatPrice: (price: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("AED")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
