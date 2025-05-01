"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { getLocalStorage } from "@/utils/storage-utils"
import { Input } from "@/components/ui/input"
import { PropertyTable } from "@/components/property-table"

export default function PropertiesClient() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simple function to safely load data from localStorage
    const loadProperties = () => {
      try {
        setIsLoading(true)
        const savedProperties = getLocalStorage("properties") || []
        setProperties(savedProperties)
        setError(null)
      } catch (err) {
        console.error("Error loading properties:", err)
        setError("Failed to load properties. Please try again.")
        setProperties([])
      } finally {
        setIsLoading(false)
      }
    }

    // Load properties on component mount
    loadProperties()
  }, [])

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  // Handle data change (e.g., after deletion)
  const handleDataChange = () => {
    try {
      const savedProperties = getLocalStorage("properties") || []
      setProperties(savedProperties)
    } catch (err) {
      console.error("Error reloading properties:", err)
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your property inventory</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/dashboard/properties/add")}>Add Property</Button>
          <Button variant="outline" onClick={() => router.push("/dashboard/properties/import")}>
            Import
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="mb-6">
        <Input
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-40">
              <p>Loading properties...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <PropertyTable
          searchQuery={searchQuery}
          data={properties}
          formatPrice={formatPrice}
          onDataChange={handleDataChange}
        />
      )}
    </div>
  )
}
