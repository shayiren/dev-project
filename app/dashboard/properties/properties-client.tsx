"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function PropertiesClient() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simple function to safely load data from localStorage
    const loadProperties = () => {
      try {
        setIsLoading(true)
        const savedProperties = localStorage.getItem("properties")
        if (savedProperties) {
          setProperties(JSON.parse(savedProperties))
        } else {
          // Initialize with empty array if no data exists
          setProperties([])
        }
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

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-40">
              <p>Loading properties...</p>
            </div>
          </CardContent>
        </Card>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-40">
              <p>No properties found. Add your first property to get started.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="font-medium">{property.title || property.unitNumber}</h3>
                    <p className="text-sm text-muted-foreground">
                      {property.projectName} - {property.location}
                    </p>
                    <p className="mt-2 font-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(property.price)}
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {property.status}
                      </span>
                    </div>
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
