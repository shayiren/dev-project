"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrency } from "@/contexts/currency-context"
import { ChevronDown } from "lucide-react"

// Area conversion constants
const SQFT_TO_SQM = 0.092903
const SQM_TO_SQFT = 10.7639

type AreaUnit = "sqft" | "sqm"

export function UnitConverters() {
  const { currency, setCurrency, currencies } = useCurrency()
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("sqft")

  // Apply area unit change to all properties in localStorage
  const handleAreaUnitChange = (newUnit: AreaUnit) => {
    if (newUnit === areaUnit) return

    try {
      // Get properties from localStorage
      const savedProperties = localStorage.getItem("properties")
      if (!savedProperties) return

      const properties = JSON.parse(savedProperties)

      // Convert all area values based on the new unit
      const updatedProperties = properties.map((property: any) => {
        if (newUnit === "sqm" && areaUnit === "sqft") {
          // Convert from sqft to sqm
          return {
            ...property,
            internalArea: Math.round(property.internalArea * SQFT_TO_SQM * 100) / 100,
            externalArea: Math.round(property.externalArea * SQFT_TO_SQM * 100) / 100,
            totalArea: Math.round(property.totalArea * SQFT_TO_SQM * 100) / 100,
            // Update price per area
            internalAreaPrice: Math.round(property.price / (property.internalArea * SQFT_TO_SQM)),
            totalPricePerSqft: Math.round(property.price / (property.totalArea * SQFT_TO_SQM)),
          }
        } else if (newUnit === "sqft" && areaUnit === "sqm") {
          // Convert from sqm to sqft
          return {
            ...property,
            internalArea: Math.round(property.internalArea * SQM_TO_SQFT * 100) / 100,
            externalArea: Math.round(property.externalArea * SQM_TO_SQFT * 100) / 100,
            totalArea: Math.round(property.totalArea * SQM_TO_SQFT * 100) / 100,
            // Update price per area
            internalAreaPrice: Math.round(property.price / (property.internalArea * SQM_TO_SQFT)),
            totalPricePerSqft: Math.round(property.price / (property.totalArea * SQM_TO_SQFT)),
          }
        }
        return property
      })

      // Save updated properties back to localStorage
      localStorage.setItem("properties", JSON.stringify(updatedProperties))

      // Update the current unit
      setAreaUnit(newUnit)

      // Save preference to localStorage
      localStorage.setItem("preferredAreaUnit", newUnit)

      // Force refresh the page to reflect changes
      window.location.reload()
    } catch (error) {
      console.error("Error updating area units:", error)
    }
  }

  // Load preferred area unit from localStorage on mount
  useEffect(() => {
    try {
      const savedUnit = localStorage.getItem("preferredAreaUnit") as AreaUnit | null
      if (savedUnit && (savedUnit === "sqft" || savedUnit === "sqm")) {
        setAreaUnit(savedUnit)
      }
    } catch (error) {
      console.error("Error loading area unit preference:", error)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            {areaUnit.toUpperCase()}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Area Unit</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleAreaUnitChange("sqft")}
            className={areaUnit === "sqft" ? "bg-muted font-medium" : ""}
          >
            Square Feet (SQFT)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAreaUnitChange("sqm")}
            className={areaUnit === "sqm" ? "bg-muted font-medium" : ""}
          >
            Square Meters (SQM)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            {currency.code}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Currency</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {currencies.map((curr) => (
            <DropdownMenuItem
              key={curr.code}
              onClick={() => setCurrency(curr)}
              className={curr.code === currency.code ? "bg-muted font-medium" : ""}
            >
              <span className="mr-2">{curr.symbol}</span>
              {curr.name} ({curr.code})
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
