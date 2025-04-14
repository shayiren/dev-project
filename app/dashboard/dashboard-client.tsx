"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/utils/format-utils"
import { PropertyAnalyticsReport } from "@/components/property-analytics-report"

export default function DashboardClient() {
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true)

        // Load properties
        const savedProperties = localStorage.getItem("properties")
        if (savedProperties) {
          setProperties(JSON.parse(savedProperties))
        } else {
          setProperties([])
        }

        // Initialize default data if needed
        ensureDefaultData()

        setError(null)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load dashboard data. Please try again.")
        setProperties([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Function to ensure default data exists
  const ensureDefaultData = () => {
    if (typeof window === "undefined") return

    try {
      // Check if properties exist
      if (!localStorage.getItem("properties")) {
        // Create sample properties
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
      }

      // Check if developers exist
      if (!localStorage.getItem("realEstateDeveloperDetails")) {
        // Create sample developers
        const sampleDevelopers = [
          {
            id: "dev1",
            name: "Prime Developers",
            contactPerson: "John Smith",
            email: "john@primedevelopers.com",
            phone: "+1 (555) 123-4567",
            description: "Luxury real estate developer with over 20 years of experience",
          },
          {
            id: "dev2",
            name: "City Builders",
            contactPerson: "Sarah Johnson",
            email: "sarah@citybuilders.com",
            phone: "+1 (555) 987-6543",
            description: "Urban development specialists focusing on modern living spaces",
          },
        ]
        localStorage.setItem("realEstateDeveloperDetails", JSON.stringify(sampleDevelopers))

        // Also save to the old key for backward compatibility
        localStorage.setItem("developers", JSON.stringify(sampleDevelopers.map((dev) => dev.name)))
      }

      // Check if projects exist
      if (!localStorage.getItem("projects")) {
        // Create sample projects
        const sampleProjects = [
          {
            id: "proj1",
            name: "Sunset Residences",
            developerName: "Prime Developers",
            location: "Miami, FL",
            description: "Luxury beachfront condominiums with panoramic ocean views",
            totalUnits: 120,
          },
          {
            id: "proj2",
            name: "Ocean View Towers",
            developerName: "Prime Developers",
            location: "San Diego, CA",
            description: "High-rise luxury apartments with stunning ocean views",
            totalUnits: 200,
          },
        ]
        localStorage.setItem("projects", JSON.stringify(sampleProjects))
      }
    } catch (error) {
      console.error("Error ensuring default data:", error)
    }
  }

  // Calculate dashboard stats
  const totalProperties = properties.length
  const availableProperties = properties.filter((p) => p.status === "Available").length
  const soldProperties = properties.filter((p) => p.status === "Sold").length
  const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0)

  // Prepare data for bedroom distribution chart
  const bedroomCounts = properties.reduce((acc: Record<string, number>, property) => {
    const bedrooms = property.bedrooms || 0
    acc[`${bedrooms} BR`] = (acc[`${bedrooms} BR`] || 0) + 1
    return acc
  }, {})

  const bedroomChartData = Object.entries(bedroomCounts).map(([name, count]) => ({
    name,
    count,
  }))

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProperties}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Units</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableProperties}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sold Units</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{soldProperties}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalValue, "AED", "AED ")}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Bedroom Distribution</CardTitle>
                <CardDescription>Distribution of properties by bedroom count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bedroomChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} Units`, "Count"]} />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Recent property sales</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <p>Loading sales...</p>
                  </div>
                ) : soldProperties === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>No sales data to display.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {properties
                      .filter((p) => p.status === "Sold")
                      .slice(0, 5)
                      .map((property) => (
                        <div key={property.id} className="flex items-center">
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{property.title || property.unitNumber}</p>
                            <p className="text-sm text-muted-foreground">{property.projectName}</p>
                          </div>
                          <div className="ml-auto font-medium">{formatCurrency(property.price, "AED", "AED ")}</div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <PropertyAnalyticsReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
