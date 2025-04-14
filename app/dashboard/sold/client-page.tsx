"use client"

import { useState } from "react"
import { SoldUnitsTable } from "@/components/sold-units-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"
import { CurrencyProvider } from "@/contexts/currency-context"

// This component uses the currency hook and must be wrapped in the provider
function SoldUnitsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const { formatPrice } = useCurrency()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sold units..."
            className="w-full sm:w-[300px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            List View
          </Button>
          <Button variant={viewMode === "card" ? "default" : "outline"} size="sm" onClick={() => setViewMode("card")}>
            Card View
          </Button>
        </div>
      </div>

      <SoldUnitsTable viewMode={viewMode} searchTerm={searchQuery} formatPrice={formatPrice} />
    </div>
  )
}

// This wrapper ensures the CurrencyProvider is available
export function SoldUnitsPageWrapper() {
  return (
    <CurrencyProvider>
      <SoldUnitsPage />
    </CurrencyProvider>
  )
}

// Add default export
export default SoldUnitsPageWrapper
