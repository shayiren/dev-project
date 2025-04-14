/**
 * Format a number as currency
 */
export function formatCurrency(amount: number, currency = "AED", symbol?: string): string {
  try {
    // Use the provided symbol or get it from the currency code
    const currencySymbol = symbol || getCurrencySymbol(currency)

    // Format the number with the appropriate currency
    return `${currencySymbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`
  } catch (error) {
    console.error("Error formatting currency:", error)
    return `${amount}`
  }
}

/**
 * Get the currency symbol for a given currency code
 */
function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    AED: "AED ", // Added AED with a space
    // Add more currencies as needed
  }

  return symbols[currency] || currency + " "
}
