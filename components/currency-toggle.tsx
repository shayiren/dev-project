"use client"

import { Button } from "@/components/ui/button"
import { useCurrency } from "@/components/currency-provider"

export function CurrencyToggle() {
  const { currency, toggleCurrency, unit, toggleUnit } = useCurrency()

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={toggleCurrency} className="text-xs">
        {currency === "AED" ? "AED" : currency === "USD" ? "$USD" : "€EUR"}
      </Button>
      <Button variant="outline" size="sm" onClick={toggleUnit} className="text-xs">
        {unit === "sqft" ? "sq.ft" : "sq.m"}
      </Button>
    </div>
  )
}
