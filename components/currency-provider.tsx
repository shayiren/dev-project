"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Currency = "AED" | "USD" | "EUR"
type Unit = "sqft" | "sqm"

interface CurrencyContextType {
  currency: Currency
  toggleCurrency: () => void
  unit: Unit
  toggleUnit: () => void
  convertCurrency: (amount: number) => number
  convertUnit: (value: number) => number
  formatCurrency: (amount: number) => string
  currencySymbol: string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("AED")
  const [unit, setUnit] = useState<Unit>("sqft")

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("preferredCurrency")
    if (savedCurrency && (savedCurrency === "AED" || savedCurrency === "USD" || savedCurrency === "EUR")) {
      setCurrency(savedCurrency as Currency)
    }

    const savedUnit = localStorage.getItem("preferredAreaUnit")
    if (savedUnit && (savedUnit === "sqft" || savedUnit === "sqm")) {
      setUnit(savedUnit as Unit)
    }
  }, [])

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem("preferredCurrency", currency)
    localStorage.setItem("preferredAreaUnit", unit)
  }, [currency, unit])

  const toggleCurrency = () => {
    setCurrency((prev) => {
      if (prev === "AED") return "USD"
      if (prev === "USD") return "EUR"
      return "AED"
    })
  }

  const toggleUnit = () => {
    setUnit((prev) => (prev === "sqft" ? "sqm" : "sqft"))
  }

  const convertCurrency = (amount: number) => {
    // Conversion rates for demonstration
    // 1 USD = 3.6725 AED
    // 1 EUR = 4.32 AED (approximate)
    if (currency === "AED") return amount
    if (currency === "USD") return amount / 3.6725
    if (currency === "EUR") return amount / 4.32
    return amount
  }

  const convertUnit = (value: number) => {
    // 1 sqft = 0.092903 sqm
    return unit === "sqft" ? value : value * 0.092903
  }

  const getCurrencySymbol = () => {
    switch (currency) {
      case "AED":
        return "AED "
      case "USD":
        return "$"
      case "EUR":
        return "€"
      default:
        return ""
    }
  }

  const formatCurrency = (amount: number) => {
    const convertedAmount = convertCurrency(amount)
    const symbol = getCurrencySymbol()

    return `${symbol}${convertedAmount.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        toggleCurrency,
        unit,
        toggleUnit,
        convertCurrency,
        convertUnit,
        formatCurrency,
        currencySymbol: getCurrencySymbol(),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
