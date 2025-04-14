"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyTable } from "@/components/property-table"
import { PropertyCards } from "@/components/property-cards"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, Plus, FileUp } from "lucide-react"
import { ensureDefaultData } from "@/utils/ensure-data"
import { useCurrency } from "@/contexts/currency-context"

export default function PropertiesClientPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { formatPrice } = useCurrency()

  // Load properties on component mount
  useEffect(() => {
    console.log("PropertiesClientPage mounted")
    ensureDefaultData()
    loadProperties()
  }, [])

  // Update the loadProperties function to exclude sold properties from the main properties view
  const loadProperties = () => {
    setIsLoading(true)
    try {
      // Get properties from localStorage
      const savedProperties = localStorage.getItem("properties")
      if (savedProperties) {
        const parsedProperties = JSON.parse(savedProperties)
        console.log("Loaded properties from localStorage:", parsedProperties.length)

        // Filter out sold properties
        const nonSoldProperties = parsedProperties.filter((p) => p.status !== "Sold")
        setProperties(nonSoldProperties)
      } else {
        console.log("No properties found in localStorage")
        // Create sample properties if none exist
        const sampleProperties = [
          {
            id: "prop1",
            unitNumber: "A101",
            title: "Modern Apartment with Ocean View",
            projectName: "Sunset Residences",
            developerName: "Prime Developers",
            buildingName: "Tower A",
            phase: "Phase 1",
            floorNumber: 1,
            unitType: "Apartment",
            bedrooms: 2,
            bathrooms: 2,
            internalArea: 950,
            externalArea: 250,
            totalArea: 1200,
            price: 450000,
            status: "Available",
            location: "Miami Beach, FL",
          },
          {
            id: "prop2",
            unitNumber: "B202",
            title: "Luxury Villa with Pool",
            projectName: "Ocean View Towers",
            developerName: "Prime Developers",
            buildingName: "Block B",
            phase: "Phase 1",
            floorNumber: 2,
            unitType: "Villa",
            bedrooms: 5,
            bathrooms: 4,
            internalArea: 3500,
            externalArea: 1000,
            totalArea: 4500,
            price: 2500000,
            status: "Available",
            location: "Beverly Hills, CA",
          },
        ]
        localStorage.setItem("properties", JSON.stringify(sampleProperties))
        setProperties(sampleProperties)
        console.log("Created sample properties:", sampleProperties.length)
      }
    } catch (error) {
      console.error("Error loading properties:", error)
      setProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your property inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => router.push("/dashboard/properties/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard/properties/import")}>
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search properties..."
            className="w-full sm:w-[300px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs
          defaultValue="table"
          className="w-[200px]"
          onValueChange={(value) => setViewMode(value as "table" | "cards")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>
        </Tabs>
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
        <Card>
          <CardHeader>
            <CardTitle>Property Inventory</CardTitle>
            <CardDescription>View and manage all properties in your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === "table" ? (
              <PropertyTable
                searchQuery={searchQuery}
                data={properties}
                formatPrice={formatPrice}
                onDataChange={loadProperties}
              />
            ) : (
              <PropertyCards searchQuery={searchQuery} onDataChange={loadProperties} formatPrice={formatPrice} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
