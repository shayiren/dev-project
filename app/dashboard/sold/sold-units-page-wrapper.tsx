"use client"

import { CurrencyProvider } from "@/components/currency-provider"
import { SoldUnitsPage } from "./sold-units-page"

export default function SoldUnitsPageWrapper() {
  return (
    <CurrencyProvider>
      <SoldUnitsPage />
    </CurrencyProvider>
  )
}
