"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SoldUnitsClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [soldUnits, setSoldUnits] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simple function to safely load data from localStorage
    const loadSoldUnits = () => {
      try {
        setIsLoading(true)
        const savedProperties = localStorage.getItem("properties")
        if (savedProperties) {
          const allProperties = JSON.parse(savedProperties)
          // Filter only sold properties
          const soldProperties = allProperties.filter((property: any) => property.status === "Sold")
          setSoldUnits(soldProperties)
        } else {
          // Initialize with empty array if no data exists
          setSoldUnits([])
        }
        setError(null)
      } catch (err) {
        console.error("Error loading sold units:", err)
        setError("Failed to load sold units. Please try again.")
        setSoldUnits([])
      } finally {
        setIsLoading(false)
      }
    }

    // Load sold units on component mount
    loadSoldUnits()
  }, [])

  // Filter sold units based on search query
  const filteredSoldUnits = soldUnits.filter((unit) => {
    if (!searchQuery) return true

    const searchLower = searchQuery.toLowerCase()
    return (
      (unit.title && unit.title.toLowerCase().includes(searchLower)) ||
      (unit.unitNumber && unit.unitNumber.toLowerCase().includes(searchLower)) ||
      (unit.projectName && unit.projectName.toLowerCase().includes(searchLower)) ||
      (unit.developerName && unit.developerName.toLowerCase().includes(searchLower))
    )
  })

  return (
    <div className="p-8 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sold Units</h1>
          <p className="text-muted-foreground">View and manage sold properties</p>
        </div>
      </div>

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

      {error && (
        <Card className="mb-6 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-40">
              <p>Loading sold units...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredSoldUnits.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-40">
              <p>No sold units found.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSoldUnits.map((unit) => (
                <Card key={unit.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="font-medium">{unit.title || unit.unitNumber}</h3>
                    <p className="text-sm text-muted-foreground">
                      {unit.projectName} - {unit.location}
                    </p>
                    <p className="mt-2 font-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(unit.price)}
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Sold</span>
                    </div>
                    {unit.clientInfo && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Client: {unit.clientInfo.clientName || "N/A"}</p>
                        <p>Agency: {unit.clientInfo.agencyName || "N/A"}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
