"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Currency = {
  code: string
  symbol: string
  name: string
  rate: number // Exchange rate relative to USD
}

const currencies: Currency[] = [
  { code: "AED", symbol: "AED ", name: "UAE Dirham", rate: 3.6725 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.85 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.75 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.12 },
]

type CurrencyContextType = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  currencies: Currency[]
  formatPrice: (price: number) => string
  convertPrice: (price: number, from: Currency, to: Currency) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Default to AED
  const [currency, setCurrency] = useState<Currency>(currencies[0])
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Try to load saved currency preference from localStorage
  useEffect(() => {
    if (!isClient) return

    try {
      const savedCurrency = localStorage.getItem("preferredCurrency")
      if (savedCurrency) {
        const parsed = JSON.parse(savedCurrency)
        if (parsed && parsed.code) {
          const found = currencies.find((c) => c.code === parsed.code)
          if (found) {
            setCurrency(found)
          }
        }
      }
    } catch (error) {
      console.error("Error loading currency preference:", error)
    }
  }, [isClient])

  // Save currency preference to localStorage when it changes
  useEffect(() => {
    if (!isClient) return

    try {
      localStorage.setItem("preferredCurrency", JSON.stringify(currency))
    } catch (error) {
      console.error("Error saving currency preference:", error)
    }
  }, [currency, isClient])

  // Convert price between currencies
  const convertPrice = (price: number, from: Currency, to: Currency): number => {
    // Convert to USD first (as base currency), then to target currency
    const usdPrice = price / from.rate
    return usdPrice * to.rate
  }

  // Format price according to the selected currency
  const formatPrice = (price: number) => {
    // For AED to USD conversion (or any other currency)
    let convertedPrice

    if (currency.code === "USD") {
      // Convert from AED to USD (divide by AED rate)
      convertedPrice = price / currencies[0].rate
    } else if (currency.code === "EUR") {
      // Convert from AED to EUR
      convertedPrice = (price / currencies[0].rate) * currencies[2].rate
    } else {
      // For AED or any other currency, use as is
      convertedPrice = price
    }

    return `${currency.symbol}${convertedPrice.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencies, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    // Instead of throwing an error, return a default implementation
    console.warn("useCurrency must be used within a CurrencyProvider")
    return {
      currency: { code: "AED", symbol: "AED ", name: "UAE Dirham", rate: 3.6725 },
      setCurrency: () => {},
      currencies: currencies,
      formatPrice: (price: number) => `AED ${price.toLocaleString()}`,
      convertPrice: (price: number) => price,
    }
  }
  return context
}
