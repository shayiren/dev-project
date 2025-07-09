"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Search } from "lucide-react"
import { DevelopmentCard } from "@/components/development-card"
import { InventoryStats } from "@/components/inventory-stats"
import { DevelopmentTable } from "@/components/development-table"

export default function DevelopmentContent() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLocation, setFilterLocation] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        const response = await fetch("/api/properties")
          .then((res) => res.json())
          .catch(() => {
            // Fallback to mock data if API fails
            return mockData
          })

        setProperties(response)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setProperties(mockData)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter properties based on search term, location, and status
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation = filterLocation === "all" || property.location === filterLocation
    const matchesStatus = filterStatus === "all" || property.status === filterStatus

    return matchesSearch && matchesLocation && matchesStatus
  })

  // Get unique locations for filter
  const locations = [...new Set(properties.map((property) => property.location))]

  // Calculate stats
  const totalUnits = properties.length
  const availableUnits = properties.filter((p) => p.status === "Available").length
  const reservedUnits = properties.filter((p) => p.status === "Reserved" || p.status === "Under Offer").length
  const soldUnits = properties.filter((p) => p.status === "Sold").length

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Development</h1>
        <p className="text-muted-foreground">Manage and track all your development projects and units</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <InventoryStats
          totalUnits={totalUnits}
          availableUnits={availableUnits}
          reservedUnits={reservedUnits}
          soldUnits={soldUnits}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Development Projects</CardTitle>
            <CardDescription>View and manage all your development projects</CardDescription>
          </div>
          <Button>Add Project</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Under Offer">Under Offer</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
              <TabsContent value="grid" className="mt-6">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <p>Loading properties...</p>
                  </div>
                ) : filteredProperties.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProperties.map((property) => (
                      <DevelopmentCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Building2 className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No properties found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="table" className="mt-6">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <p>Loading properties...</p>
                  </div>
                ) : filteredProperties.length > 0 ? (
                  <DevelopmentTable properties={filteredProperties} />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Building2 className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No properties found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mock data based on the CSV
const mockData = [
  {
    id: "imp-001",
    unitNumber: "DM-101",
    title: "Marina View Apartment 1",
    projectName: "Dubai Marina Towers",
    developerName: "Prime Developers",
    buildingName: "Tower A",
    phase: "Phase 1",
    floorNumber: "1",
    location: "Dubai Marina",
    price: 4500000,
    type: "Apartment",
    unitType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    internalArea: 1200,
    externalArea: 300,
    totalArea: 1500,
    internalAreaPrice: 3750,
    totalPricePerSqft: 3000,
    status: "Available",
    views: "Marina View",
    floorPlate: "A1",
  },
  {
    id: "imp-002",
    unitNumber: "DM-102",
    title: "Marina View Apartment 2",
    projectName: "Dubai Marina Towers",
    developerName: "Prime Developers",
    buildingName: "Tower A",
    phase: "Phase 1",
    floorNumber: "1",
    location: "Dubai Marina",
    price: 4800000,
    type: "Apartment",
    unitType: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    internalArea: 1500,
    externalArea: 300,
    totalArea: 1800,
    internalAreaPrice: 3200,
    totalPricePerSqft: 2667,
    status: "Available",
    views: "Marina View",
    floorPlate: "A1",
  },
  {
    id: "imp-003",
    unitNumber: "DM-103",
    title: "Marina View Apartment 3",
    projectName: "Dubai Marina Towers",
    developerName: "Prime Developers",
    buildingName: "Tower A",
    phase: "Phase 1",
    floorNumber: "2",
    location: "Dubai Marina",
    price: 5200000,
    type: "Apartment",
    unitType: "Penthouse",
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2000,
    internalArea: 1700,
    externalArea: 300,
    totalArea: 2000,
    internalAreaPrice: 3059,
    totalPricePerSqft: 2600,
    status: "Reserved",
    views: "Marina View",
    floorPlate: "A2",
  },
  {
    id: "imp-004",
    unitNumber: "DM-201",
    title: "Marina View Apartment 4",
    projectName: "Dubai Marina Towers",
    developerName: "Prime Developers",
    buildingName: "Tower B",
    phase: "Phase 1",
    floorNumber: "2",
    location: "Dubai Marina",
    price: 4300000,
    type: "Apartment",
    unitType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    internalArea: 1100,
    externalArea: 300,
    totalArea: 1400,
    internalAreaPrice: 3909,
    totalPricePerSqft: 3071,
    status: "Available",
    views: "Marina View",
    floorPlate: "B2",
  },
  {
    id: "imp-005",
    unitNumber: "DM-202",
    title: "Marina View Apartment 5",
    projectName: "Dubai Marina Towers",
    developerName: "Prime Developers",
    buildingName: "Tower B",
    phase: "Phase 1",
    floorNumber: "3",
    location: "Dubai Marina",
    price: 6500000,
    type: "Apartment",
    unitType: "Penthouse",
    bedrooms: 4,
    bathrooms: 4.5,
    area: 2500,
    internalArea: 2100,
    externalArea: 400,
    totalArea: 2500,
    internalAreaPrice: 3095,
    totalPricePerSqft: 2600,
    status: "Sold",
    views: "Marina View",
    floorPlate: "B3",
  },
  {
    id: "imp-006",
    unitNumber: "DT-101",
    title: "Downtown Apartment 1",
    projectName: "Burj Views",
    developerName: "City Builders",
    buildingName: "Tower C",
    phase: "Phase 2",
    floorNumber: "1",
    location: "Downtown Dubai",
    price: 7200000,
    type: "Apartment",
    unitType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1600,
    internalArea: 1300,
    externalArea: 300,
    totalArea: 1600,
    internalAreaPrice: 5538,
    totalPricePerSqft: 4500,
    status: "Available",
    views: "Burj View",
    floorPlate: "C1",
  },
  {
    id: "imp-007",
    unitNumber: "DT-102",
    title: "Downtown Apartment 2",
    projectName: "Burj Views",
    developerName: "City Builders",
    buildingName: "Tower C",
    phase: "Phase 2",
    floorNumber: "1",
    location: "Downtown Dubai",
    price: 7500000,
    type: "Apartment",
    unitType: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1900,
    internalArea: 1600,
    externalArea: 300,
    totalArea: 1900,
    internalAreaPrice: 4688,
    totalPricePerSqft: 3947,
    status: "Available",
    views: "Burj View",
    floorPlate: "C1",
  },
  {
    id: "imp-008",
    unitNumber: "DT-103",
    title: "Downtown Apartment 3",
    projectName: "Burj Views",
    developerName: "City Builders",
    buildingName: "Tower C",
    phase: "Phase 2",
    floorNumber: "2",
    location: "Downtown Dubai",
    price: 8200000,
    type: "Apartment",
    unitType: "Penthouse",
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2100,
    internalArea: 1800,
    externalArea: 300,
    totalArea: 2100,
    internalAreaPrice: 4556,
    totalPricePerSqft: 3905,
    status: "Under Offer",
    views: "Burj View",
    floorPlate: "C2",
  },
  {
    id: "imp-009",
    unitNumber: "DT-201",
    title: "Downtown Apartment 4",
    projectName: "Burj Views",
    developerName: "City Builders",
    buildingName: "Tower D",
    phase: "Phase 2",
    floorNumber: "2",
    location: "Downtown Dubai",
    price: 6800000,
    type: "Apartment",
    unitType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    internalArea: 1200,
    externalArea: 300,
    totalArea: 1500,
    internalAreaPrice: 5667,
    totalPricePerSqft: 4533,
    status: "Available",
    views: "Burj View",
    floorPlate: "D2",
  },
  {
    id: "imp-010",
    unitNumber: "DT-202",
    title: "Downtown Apartment 5",
    projectName: "Burj Views",
    developerName: "City Builders",
    buildingName: "Tower D",
    phase: "Phase 2",
    floorNumber: "3",
    location: "Downtown Dubai",
    price: 9500000,
    type: "Apartment",
    unitType: "Penthouse",
    bedrooms: 4,
    bathrooms: 4.5,
    area: 2600,
    internalArea: 2200,
    externalArea: 400,
    totalArea: 2600,
    internalAreaPrice: 4318,
    totalPricePerSqft: 3654,
    status: "Sold",
    views: "Burj View",
    floorPlate: "D3",
  },
  {
    id: "imp-011",
    unitNumber: "PJ-101",
    title: "Palm Villa 1",
    projectName: "Palm Residences",
    developerName: "Metro Construction",
    buildingName: "Frond E",
    phase: "Phase 3",
    floorNumber: "1",
    location: "Palm Jumeirah",
    price: 15000000,
    type: "Villa",
    unitType: "Villa",
    bedrooms: 4,
    bathrooms: 4.5,
    area: 4000,
    internalArea: 3500,
    externalArea: 500,
    totalArea: 4000,
    internalAreaPrice: 4286,
    totalPricePerSqft: 3750,
    status: "Available",
    views: "Sea View",
    floorPlate: "E1",
  },
  {
    id: "imp-012",
    unitNumber: "PJ-102",
    title: "Palm Villa 2",
    projectName: "Palm Residences",
    developerName: "Metro Construction",
    buildingName: "Frond E",
    phase: "Phase 3",
    floorNumber: "1",
    location: "Palm Jumeirah",
    price: 18000000,
    type: "Villa",
    unitType: "Villa",
    bedrooms: 5,
    bathrooms: 5.5,
    area: 5000,
    internalArea: 4300,
    externalArea: 700,
    totalArea: 5000,
    internalAreaPrice: 4186,
    totalPricePerSqft: 3600,
    status: "Reserved",
    views: "Sea View",
    floorPlate: "E1",
  },
  {
    id: "imp-013",
    unitNumber: "PJ-103",
    title: "Palm Villa 3",
    projectName: "Palm Residences",
    developerName: "Metro Construction",
    buildingName: "Frond F",
    phase: "Phase 3",
    floorNumber: "1",
    location: "Palm Jumeirah",
    price: 22000000,
    type: "Villa",
    unitType: "Villa",
    bedrooms: 6,
    bathrooms: 6.5,
    area: 6000,
    internalArea: 5200,
    externalArea: 800,
    totalArea: 6000,
    internalAreaPrice: 4231,
    totalPricePerSqft: 3667,
    status: "Sold",
    views: "Sea View",
    floorPlate: "F1",
  },
  {
    id: "imp-014",
    unitNumber: "RAK-101",
    title: "RAK Apartment 1",
    projectName: "RAK Towers",
    developerName: "Ardeee",
    buildingName: "Tower G",
    phase: "Phase 1",
    floorNumber: "1",
    location: "Ras Al Khaimah",
    price: 2800000,
    type: "Apartment",
    unitType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1300,
    internalArea: 1100,
    externalArea: 200,
    totalArea: 1300,
    internalAreaPrice: 2545,
    totalPricePerSqft: 2154,
    status: "Available",
    views: "Mountain View",
    floorPlate: "G1",
  },
  {
    id: "imp-015",
    unitNumber: "RAK-102",
    title: "RAK Apartment 2",
    projectName: "RAK Towers",
    developerName: "Ardeee",
    buildingName: "Tower G",
    phase: "Phase 1",
    floorNumber: "2",
    location: "Ras Al Khaimah",
    price: 3200000,
    type: "Apartment",
    unitType: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1600,
    internalArea: 1400,
    externalArea: 200,
    totalArea: 1600,
    internalAreaPrice: 2286,
    totalPricePerSqft: 2000,
    status: "Available",
    views: "Mountain View",
    floorPlate: "G2",
  },
]
