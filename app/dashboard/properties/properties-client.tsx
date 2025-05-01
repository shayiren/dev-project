"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"

// Sample property data
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
  {
    id: "prop3",
    unitNumber: "C303",
    title: "Downtown Loft",
    projectName: "City Center",
    developerName: "Urban Developers",
    buildingName: "Block C",
    phase: "Phase 2",
    floorNumber: 3,
    unitType: "Loft",
    bedrooms: 1,
    bathrooms: 1,
    internalArea: 800,
    externalArea: 50,
    totalArea: 850,
    price: 350000,
    status: "Reserved",
    location: "New York, NY",
  },
  {
    id: "prop4",
    unitNumber: "D404",
    title: "Waterfront Condo",
    projectName: "Harbor View",
    developerName: "Coastal Developers",
    buildingName: "Tower D",
    phase: "Phase 1",
    floorNumber: 4,
    unitType: "Condo",
    bedrooms: 3,
    bathrooms: 2,
    internalArea: 1600,
    externalArea: 200,
    totalArea: 1800,
    price: 750000,
    status: "Available",
    location: "Seattle, WA",
  },
  {
    id: "prop5",
    unitNumber: "E505",
    title: "Penthouse Suite",
    projectName: "Skyline Residences",
    developerName: "Luxury Developers",
    buildingName: "Tower E",
    phase: "Phase 3",
    floorNumber: 20,
    unitType: "Penthouse",
    bedrooms: 4,
    bathrooms: 3,
    internalArea: 2800,
    externalArea: 700,
    totalArea: 3500,
    price: 3500000,
    status: "Under Offer",
    location: "Chicago, IL",
  },
]

export default function PropertiesClient() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load properties on component mount
    const loadProperties = () => {
      try {
        setIsLoading(true)

        // Try to get properties from localStorage
        let savedProperties = []
        if (typeof window !== "undefined") {
          const storedProperties = localStorage.getItem("properties")
          if (storedProperties) {
            savedProperties = JSON.parse(storedProperties)
          }
        }

        // If no properties in localStorage, use sample data
        if (!savedProperties || savedProperties.length === 0) {
          savedProperties = sampleProperties
          // Save sample data to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("properties", JSON.stringify(sampleProperties))
          }
        }

        setProperties(savedProperties)
        setError(null)
      } catch (err) {
        console.error("Error loading properties:", err)
        // Fallback to sample data on error
        setProperties(sampleProperties)
        setError("Error loading saved properties. Showing sample data instead.")
      } finally {
        setIsLoading(false)
      }
    }

    loadProperties()
  }, [])

  // Filter properties based on search query
  const filteredProperties = properties.filter((property) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      property.unitNumber?.toLowerCase().includes(searchLower) ||
      property.title?.toLowerCase().includes(searchLower) ||
      property.projectName?.toLowerCase().includes(searchLower) ||
      property.location?.toLowerCase().includes(searchLower)
    )
  })

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  // Handle property deletion
  const handleDelete = (id: string) => {
    try {
      const updatedProperties = properties.filter((property) => property.id !== id)
      setProperties(updatedProperties)

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("properties", JSON.stringify(updatedProperties))
      }
    } catch (err) {
      console.error("Error deleting property:", err)
      setError("Failed to delete property. Please try again.")
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your property inventory</p>
        </div>
        <Button onClick={() => router.push("/dashboard/properties/add")}>Add Property</Button>
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
      ) : filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-40">
              <p>No properties found. Add your first property to get started.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Property Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Beds</TableHead>
                    <TableHead>Area (sqft)</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>{property.unitNumber}</TableCell>
                      <TableCell>{property.projectName}</TableCell>
                      <TableCell>{property.unitType}</TableCell>
                      <TableCell>{property.bedrooms}</TableCell>
                      <TableCell>{property.totalArea}</TableCell>
                      <TableCell>{formatPrice(property.price)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            property.status === "Available"
                              ? "bg-green-100 text-green-800"
                              : property.status === "Reserved"
                                ? "bg-blue-100 text-blue-800"
                                : property.status === "Under Offer"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : property.status === "Sold"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {property.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/dashboard/properties/edit/${property.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(property.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
