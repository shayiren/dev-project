"use client"

import { formatCurrency } from "@/lib/format-currency"

/**
 * A client-side hook for currency formatting
 * This is safe to use in client components
 */
export function useClientCurrency() {
  return {
    format: formatCurrency,
  }
}
