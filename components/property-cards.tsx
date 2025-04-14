"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Eye, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"
import { getAllProperties } from "@/utils/storage-utils"

interface PropertyCardsProps {
  searchQuery: string
  onDataChange?: () => void
  formatPrice?: (price: number) => string
}

export function PropertyCards({ searchQuery, onDataChange, formatPrice }: PropertyCardsProps) {
  const [properties, setProperties] = useState<any[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadProperties()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = properties.filter(
        (property) =>
          // Don't show sold properties in the main view
          property.status !== "Sold" &&
          (property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.developerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.unitNumber?.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredProperties(filtered)
    } else {
      // Filter out sold properties
      setFilteredProperties(properties.filter((property) => property.status !== "Sold"))
    }
  }, [searchQuery, properties])

  const loadProperties = () => {
    setIsLoading(true)
    try {
      const allProperties = getAllProperties()
      setProperties(allProperties)
      // Filter out sold properties from the main view
      setFilteredProperties(allProperties.filter((property) => property.status !== "Sold"))
    } catch (error) {
      console.error("Error loading properties:", error)
      setProperties([])
      setFilteredProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewProperty = (property: any) => {
    setSelectedProperty(property)
  }

  const handleEditProperty = (property: any) => {
    // Implement edit functionality
    console.log("Edit property:", property)
  }

  const handleDeleteProperty = (property: any) => {
    // Implement delete functionality
    console.log("Delete property:", property)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500"
      case "Reserved":
        return "bg-yellow-500"
      case "Sold":
        return "bg-red-500"
      case "Under Offer":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Don't render anything until we're on the client
  if (!isClient) {
    return <div>Loading properties...</div>
  }

  if (isLoading) {
    return <div>Loading properties...</div>
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full text-center py-8">No properties found</div>
        ) : (
          filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                <img
                  src={property.imageUrl || "/placeholder.svg?height=400&width=600"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <Badge
                  variant="outline"
                  className={`${getStatusColor(property.status)} text-white border-none absolute top-2 right-2`}
                >
                  {property.status}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{property.title}</CardTitle>
                  <div className="text-lg font-bold">
                    {formatPrice ? formatPrice(property.price) : property.price.toLocaleString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground mb-2">
                  {property.projectName} - {property.location}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Unit:</span> {property.unitNumber}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Type:</span> {property.unitType}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Beds:</span> {property.bedrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Baths:</span> {property.bathrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Area:</span> {property.area} sqft
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm" onClick={() => handleViewProperty(property)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditProperty(property)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProperty(property)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        {selectedProperty && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedProperty.title}</DialogTitle>
              <DialogDescription>
                {selectedProperty.projectName} - {selectedProperty.location}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedProperty.imageUrl || "/placeholder.svg?height=400&width=600"}
                  alt={selectedProperty.title}
                  className="w-full h-auto rounded-md"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Property Details</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-muted-foreground">Unit Number:</div>
                    <div className="text-sm">{selectedProperty.unitNumber}</div>
                    <div className="text-sm text-muted-foreground">Project:</div>
                    <div className="text-sm">{selectedProperty.projectName}</div>
                    <div className="text-sm text-muted-foreground">Developer:</div>
                    <div className="text-sm">{selectedProperty.developerName}</div>
                    <div className="text-sm text-muted-foreground">Building:</div>
                    <div className="text-sm">{selectedProperty.buildingName}</div>
                    <div className="text-sm text-muted-foreground">Phase:</div>
                    <div className="text-sm">{selectedProperty.phase}</div>
                    <div className="text-sm text-muted-foreground">Floor:</div>
                    <div className="text-sm">{selectedProperty.floorNumber}</div>
                    <div className="text-sm text-muted-foreground">Type:</div>
                    <div className="text-sm">{selectedProperty.unitType}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms:</div>
                    <div className="text-sm">{selectedProperty.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms:</div>
                    <div className="text-sm">{selectedProperty.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Total Area:</div>
                    <div className="text-sm">{selectedProperty.area} sqft</div>
                    <div className="text-sm text-muted-foreground">Internal Area:</div>
                    <div className="text-sm">{selectedProperty.internalArea} sqft</div>
                    <div className="text-sm text-muted-foreground">External Area:</div>
                    <div className="text-sm">{selectedProperty.externalArea} sqft</div>
                    <div className="text-sm text-muted-foreground">Price:</div>
                    <div className="text-sm font-semibold">
                      {formatPrice ? formatPrice(selectedProperty.price) : selectedProperty.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Price/sqft:</div>
                    <div className="text-sm">{formatCurrency(selectedProperty.totalPricePerSqft, "USD")}/sqft</div>
                    <div className="text-sm text-muted-foreground">Status:</div>
                    <div className="text-sm">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(selectedProperty.status)} text-white border-none`}
                      >
                        {selectedProperty.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                {selectedProperty.description && (
                  <div>
                    <h3 className="text-lg font-semibold">Description</h3>
                    <p className="text-sm mt-2">{selectedProperty.description}</p>
                  </div>
                )}
              </div>
            </div>
            {selectedProperty.floorPlan && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Floor Plan</h3>
                <img
                  src={selectedProperty.floorPlan || "/placeholder.svg"}
                  alt="Floor Plan"
                  className="w-full max-h-[400px] object-contain rounded-md"
                />
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
