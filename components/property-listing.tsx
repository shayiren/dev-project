"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface Property {
  id: number
  name: string
  project_id: number
  status: string
  property_type: string
  bedrooms: number
  view_type: string
  payment_plan: string
  handover_date: string
  price: number
  area: number
  image: string
}

interface PropertyListingProps {
  properties: Property[]
  onCompare: (properties: Property[]) => void
}

export function PropertyListing({ properties, onCompare }: PropertyListingProps) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([])

  const togglePropertySelection = (property: Property) => {
    if (selectedProperties.find((p) => p.id === property.id)) {
      setSelectedProperties(selectedProperties.filter((p) => p.id !== property.id))
    } else {
      setSelectedProperties([...selectedProperties, property])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Properties</h2>
        <Button onClick={() => onCompare(selectedProperties)} disabled={selectedProperties.length < 2}>
          Compare Selected ({selectedProperties.length})
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative">
                <Image
                  src={property.image || "/placeholder.svg?height=200&width=400"}
                  alt={property.name}
                  width={400}
                  height={200}
                  className="object-cover w-full h-48"
                />
                <div className="absolute top-2 right-2">
                  <Checkbox
                    checked={selectedProperties.some((p) => p.id === property.id)}
                    onCheckedChange={() => togglePropertySelection(property)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg font-bold">{property.name}</CardTitle>
              <div className="flex justify-between items-center mt-2">
                <Badge>{property.status}</Badge>
                <Badge variant="outline">{property.property_type}</Badge>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>{property.bedrooms} bedrooms</p>
                <p>{property.view_type} view</p>
                <p>Handover: {new Date(property.handover_date).toLocaleDateString()}</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between text-sm">
              <span className="font-bold text-lg">
                {new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(property.price)}
              </span>
              <span>{property.area} sqft</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
