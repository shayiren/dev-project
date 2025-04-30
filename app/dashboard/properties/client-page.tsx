"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PropertyTable } from "@/components/property-table"
import { PropertyCards } from "@/components/property-cards"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, Plus, FileUp, Filter, Grid, List } from "lucide-react"
import { ensureDefaultData } from "@/utils/ensure-data"
import { useCurrency } from "@/contexts/currency-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function PropertiesClientPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { formatPrice } = useCurrency()
  const [activeTab, setActiveTab] = useState<"all" | "Available" | "Reserved" | "Under Offer" | "Sold">("all")
  const [filterDeveloper, setFilterDeveloper] = useState<string>("all")
  const [filterProject, setFilterProject] = useState<string>("all")
  const [filterPhase, setFilterPhase] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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
        setProperties(parsedProperties) // Keep all properties for filtering
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

  // Get unique values for filters
  const developers = Array.from(new Set(properties?.map((p) => p.developerName) || []))
  const projects = Array.from(new Set(properties?.map((p) => p.projectName) || []))
  const phases = Array.from(new Set(properties?.map((p) => p.phase) || []))

  // Toggle filter panel on mobile
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search properties..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="md:hidden w-full" onClick={toggleFilter}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px]">
                  <div className="p-2 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="developer-filter">Developer</Label>
                      <Select value={filterDeveloper} onValueChange={setFilterDeveloper}>
                        <SelectTrigger id="developer-filter">
                          <SelectValue placeholder="All Developers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Developers</SelectItem>
                          {developers.map((dev) => (
                            <SelectItem key={dev} value={dev}>
                              {dev}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-filter">Project</Label>
                      <Select value={filterProject} onValueChange={setFilterProject}>
                        <SelectTrigger id="project-filter">
                          <SelectValue placeholder="All Projects" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Projects</SelectItem>
                          {projects.map((proj) => (
                            <SelectItem key={proj} value={proj}>
                              {proj}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phase-filter">Phase</Label>
                      <Select value={filterPhase} onValueChange={setFilterPhase}>
                        <SelectTrigger id="phase-filter">
                          <SelectValue placeholder="All Phases" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Phases</SelectItem>
                          {phases.map((phase) => (
                            <SelectItem key={phase} value={phase}>
                              {phase}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status-filter">Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger id="status-filter">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Reserved">Reserved</SelectItem>
                          <SelectItem value="Sold">Sold</SelectItem>
                          <SelectItem value="Under Offer">Under Offer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
            title="Table View"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("cards")}
            title="Card View"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile filter panel */}
      <div
        className={`fixed inset-0 z-30 bg-background transition-transform transform ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={toggleFilter}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile-developer-filter">Developer</Label>
            <Select value={filterDeveloper} onValueChange={setFilterDeveloper}>
              <SelectTrigger id="mobile-developer-filter">
                <SelectValue placeholder="All Developers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Developers</SelectItem>
                {developers.map((dev) => (
                  <SelectItem key={dev} value={dev}>
                    {dev}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile-project-filter">Project</Label>
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger id="mobile-project-filter">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((proj) => (
                  <SelectItem key={proj} value={proj}>
                    {proj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile-status-filter">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="mobile-status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
                <SelectItem value="Under Offer">Under Offer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full mt-4" onClick={toggleFilter}>
            Apply Filters
          </Button>
        </div>
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
            <Tabs
              defaultValue="all"
              className="w-full"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as any)}
            >
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="all" className="rounded-md">
                  All
                </TabsTrigger>
                <TabsTrigger value="Available" className="rounded-md">
                  Available
                </TabsTrigger>
                <TabsTrigger value="Reserved" className="rounded-md">
                  Reserved
                </TabsTrigger>
                <TabsTrigger value="Under Offer" className="rounded-md">
                  Under Offer
                </TabsTrigger>
                <TabsTrigger value="Sold" className="rounded-md">
                  Sold
                </TabsTrigger>
              </TabsList>

              {["all", "Available", "Reserved", "Under Offer", "Sold"].map((status) => (
                <TabsContent key={status} value={status} className="mt-0">
                  {viewMode === "table" ? (
                    <PropertyTable
                      searchQuery={searchQuery}
                      data={properties.filter((p) => status === "all" || p.status === status)}
                      formatPrice={formatPrice}
                      onDataChange={loadProperties}
                    />
                  ) : (
                    <PropertyCards searchQuery={searchQuery} onDataChange={loadProperties} formatPrice={formatPrice} />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
