"use client"
import { useState, useEffect } from "react"
import { useMemo } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Edit, Trash2, Download } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Define the Property type
interface Property {
  id: string
  title: string
  address: string
  price: number
  status: string
  projectName: string
  internalArea: number
  externalArea: number
  internalAreaPrice: number
  externalAreaPrice: number
  totalUnits: number
  unitNumber: string
  developerName: string
  buildingName: string
  phase: string
  floorNumber: number
  unitType: string
  bedrooms: number
  bathrooms: number
  totalArea: number
  externalAreaPrice?: number
  totalPricePerSqft?: number
  floorPlan?: string
  clientInfo?: {
    agencyName: string
    agentName: string
    clientName: string
    clientEmail?: string
    clientPhone?: string
  } | null
  soldDate?: string | null
}

interface PropertyTableProps {
  searchQuery: string
  data?: any[]
  formatPrice?: (price: number) => string
  onDataChange?: () => void
}

// Helper functions for export and status colors
const exportToCSV = (data: any[], fields: { label: string; value: string }[], filename: string) => {
  // Create CSV header
  const header = fields.map((field) => field.label).join(",")

  // Create CSV rows
  const rows = data.map((item) => {
    return fields
      .map((field) => {
        const value = item[field.value]
        // Handle strings with commas by wrapping in quotes
        return typeof value === "string" && value.includes(",") ? `"${value}"` : value
      })
      .join(",")
  })

  // Combine header and rows
  const csv = [header, ...rows].join("\n")

  // Create download link
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportToExcel = (data: any[], fields: { label: string; value: string }[], filename: string) => {
  // For simplicity, we'll just use CSV export as a fallback
  // In a real app, you would use a library like xlsx
  exportToCSV(data, fields, filename)
}

const getStatusColor = (status: string, type: "bg" | "text" | "border") => {
  switch (status) {
    case "Available":
      return type === "bg" ? "rgba(0, 200, 83, 0.1)" : type === "text" ? "#00c853" : "rgba(0, 200, 83, 0.5)"
    case "Reserved":
      return type === "bg" ? "rgba(255, 152, 0, 0.1)" : type === "text" ? "#ff9800" : "rgba(255, 152, 0, 0.5)"
    case "Sold":
      return type === "bg" ? "rgba(244, 67, 54, 0.1)" : type === "text" ? "#f44336" : "rgba(244, 67, 54, 0.5)"
    case "Under Offer":
      return type === "bg" ? "rgba(33, 150, 243, 0.1)" : type === "text" ? "#2196f3" : "rgba(33, 150, 243, 0.5)"
    default:
      return type === "bg" ? "transparent" : type === "text" ? "inherit" : "transparent"
  }
}

// Define the fields for export
const exportFields = [
  { label: "Unit Number", value: "unitNumber" },
  { label: "Project Name", value: "projectName" },
  { label: "Developer Name", value: "developerName" },
  { label: "Building Name", value: "buildingName" },
  { label: "Phase", value: "phase" },
  { label: "Floor Number", value: "floorNumber" },
  { label: "Unit Type", value: "unitType" },
  { label: "Bedrooms", value: "bedrooms" },
  { label: "Bathrooms", value: "bathrooms" },
  { label: "Internal Area", value: "internalArea" },
  { label: "External Area", value: "externalArea" },
  { label: "Total Area", value: "totalArea" },
  { label: "Price", value: "price" },
  { label: "Internal Area Price", value: "internalAreaPrice" },
  { label: "Status", value: "status" },
]

export function PropertyTable({ searchQuery, data, formatPrice, onDataChange }: PropertyTableProps) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [areaUnit, setAreaUnit] = useState<"sqft" | "sqm">("sqft")

  // Load area unit preference
  useEffect(() => {
    const savedAreaUnit = localStorage.getItem("preferredAreaUnit") as "sqft" | "sqm" | null
    if (savedAreaUnit && (savedAreaUnit === "sqft" || savedAreaUnit === "sqm")) {
      setAreaUnit(savedAreaUnit)
    }
  }, [])

  // Filter properties based on search query
  useEffect(() => {
    if (data) {
      console.log("Filtering properties with searchQuery:", searchQuery)
      let filtered = [...data]

      if (searchQuery) {
        filtered = filtered.filter(
          (property) =>
            property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.unitNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      console.log("Filtered properties count:", filtered.length)
      setFilteredProperties(filtered)
    } else {
      console.log("No data provided to PropertyTable")
      setFilteredProperties([])
    }
  }, [searchQuery, data])

  // Toggle property selection
  const togglePropertySelection = (id: string) => {
    console.log("Toggling selection for property:", id)
    setSelectedProperties((prev) => {
      if (prev.includes(id)) {
        return prev.filter((propId) => propId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      console.log("Clearing all selections")
      setSelectedProperties([])
    } else {
      const allIds = filteredProperties.map((p) => p.id)
      console.log("Selecting all properties:", allIds.length)
      setSelectedProperties(allIds)
    }
  }

  // Get status color for badges
  const getStatusColor2 = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Reserved":
        return "bg-yellow-100 text-yellow-800"
      case "Sold":
        return "bg-red-100 text-red-800"
      case "Under Offer":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProperties2, setSelectedProperties22] = useState<string[]>([])
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [selectedExportFields, setSelectedExportFields] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [isFloorPlanDialogOpen, setIsFloorPlanDialogOpen] = useState(false)
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<string | null>(null)
  const [filterDeveloper, setFilterDeveloper] = useState<string>("all")
  const [filterProject, setFilterProject] = useState<string>("all")
  const [filterPhase, setFilterPhase] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [filteredProperties22, setFilteredProperties22] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "Available" | "Reserved" | "Under Offer" | "Sold">("all")

  useEffect(() => {
    setIsClient(true)
    loadProperties()
  }, [])

  // Update the useEffect hook for filtering properties to exclude sold units from the "All" tab
  useEffect(() => {
    if (data) {
      let filtered = [...data]

      // Apply search filter if searchQuery exists
      if (searchQuery) {
        filtered = filtered.filter(
          (property) =>
            property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.developerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.unitNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // Exclude sold properties by default
      filtered = filtered.filter((property) => property.status !== "Sold")

      setFilteredProperties(filtered)
    }
  }, [searchQuery, data])

  const loadProperties = () => {
    setIsLoading(true)
    try {
      // Get all properties from localStorage
      const savedProperties = localStorage.getItem("properties")
      if (savedProperties) {
        const allProperties = JSON.parse(savedProperties)
        setProperties(allProperties)
        setFilteredProperties(allProperties)

        // Make sure filteredProperties22 is populated
        if (data) {
          const filtered = data.filter((property) => {
            // Remove any overly restrictive filters that might be hiding properties
            return true // Show all properties initially
          })
          setFilteredProperties22(filtered)
        } else {
          setFilteredProperties22(allProperties)
        }
      }
    } catch (error) {
      console.error("Error loading properties:", error)
      setProperties([])
      setFilteredProperties([])
      setFilteredProperties22([])
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

  // Load properties from localStorage on component mount
  useEffect(() => {
    const savedProperties = localStorage.getItem("properties")
    if (savedProperties) {
      try {
        const parsedProperties = JSON.parse(savedProperties)
        // setProperties(parsedProperties)
      } catch (error) {
        console.error("Error parsing properties from localStorage:", error)
      }
    }

    // Load area unit preference
    const savedAreaUnit = localStorage.getItem("preferredAreaUnit") as "sqft" | "sqm" | null
    if (savedAreaUnit && (savedAreaUnit === "sqft" || savedAreaUnit === "sqm")) {
      setAreaUnit(savedAreaUnit)
    }
  }, [])

  // Save properties to localStorage whenever they change
  useEffect(() => {
    // localStorage.setItem("properties", JSON.stringify(properties))
  }, [data])

  // Get unique values for filters
  const developers = Array.from(new Set(data?.map((p) => p.developerName) || []))
  const projects = Array.from(new Set(data?.map((p) => p.projectName) || []))
  const phases = Array.from(new Set(data?.map((p) => p.phase) || []))

  // Filter properties based on search term and filters
  const filteredProperties222 =
    data?.filter((property) => {
      // Search term filter
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.projectName.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || property.status === statusFilter

      // Project filter
      const matchesProject = projectFilter === "all" || property.projectName === projectFilter

      return matchesSearch && matchesStatus && matchesProject
    }) || []

  // Handle property selection for bulk actions
  const togglePropertySelection2 = (id: string) => {
    console.log("Toggling selection for property:", id)
    setSelectedProperties22((prev) => {
      const newSelection = prev.includes(id) ? prev.filter((propId) => propId !== id) : [...prev, id]
      console.log("New selection:", newSelection)
      return newSelection
    })
  }

  // Handle select all properties
  const toggleSelectAll2 = () => {
    if (selectedProperties2.length === filteredProperties.length) {
      setSelectedProperties22([])
    } else {
      setSelectedProperties22(filteredProperties.map((p: any) => p.id))
    }
  }

  // Handle export dialog
  const openExportDialog = () => {
    const exportFields = [
      { label: "Unit Number", value: "unitNumber" },
      { label: "Project Name", value: "projectName" },
      { label: "Developer Name", value: "developerName" },
      { label: "Building Name", value: "buildingName" },
      { label: "Phase", value: "phase" },
      { label: "Floor Number", value: "floorNumber" },
      { label: "Unit Type", value: "unitType" },
      { label: "Bedrooms", value: "bedrooms" },
      { label: "Bathrooms", value: "bathrooms" },
      { label: "Internal Area", value: "internalArea" },
      { label: "External Area", value: "externalArea" },
      { label: "Total Area", value: "totalArea" },
      { label: "Price", value: "price" },
      { label: "Status", value: "status" },
    ]

    setSelectedExportFields(exportFields.map((field) => field.value))
    setIsExportDialogOpen(true)
  }

  // Handle export
  const handleExport2 = (format: "csv" | "excel") => {
    const selectedPropertiesData = data?.filter((p) => selectedProperties2.includes(p.id)) || []
    const fieldsToExport = exportFields.filter((field) => selectedExportFields.includes(field.value))

    if (format === "csv") {
      exportToCSV(selectedPropertiesData, fieldsToExport, "properties_export")
    } else {
      exportToExcel(selectedPropertiesData, fieldsToExport, "properties_export")
    }

    setIsExportDialogOpen(false)
  }

  // Handle floor plan view
  const viewFloorPlan = (floorPlan: string) => {
    setSelectedFloorPlan(floorPlan)
    setIsFloorPlanDialogOpen(true)
  }

  // Handle edit property
  const editProperty = (property: Property) => {
    setCurrentProperty({ ...property })
    setIsEditDialogOpen(true)
  }

  // Handle save edited property
  const saveEditedProperty = () => {
    if (currentProperty) {
      // Check if trying to change to Sold status
      if (currentProperty.status === "Sold") {
        // Find the original property to check its previous status
        const originalProperty = data?.find((p) => p.id === currentProperty.id)

        if (
          originalProperty &&
          (originalProperty.status === "Available" ||
            originalProperty.status === "Reserved" ||
            originalProperty.status === "Under Offer")
        ) {
          // Need client info to change to Sold
          // setPropertyToChangeStatus({
          //   property: currentProperty,
          //   newStatus: "Sold",
          //   isBulk: false,
          // })
          // setIsClientInfoDialogOpen(true)
          setIsEditDialogOpen(false)
          return
        }
      }

      // Otherwise proceed with the update
      // setProperties((prev) => prev.map((p) => (p.id === currentProperty.id ? currentProperty : p)))
      setIsEditDialogOpen(false)
      setCurrentProperty(null)
    }
  }

  // Handle delete property
  const openDeleteDialog = (id: string) => {
    setPropertyToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (propertyToDelete) {
      // setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete))
      setIsDeleteDialogOpen(false)
      setPropertyToDelete(null)
    }
  }

  // Toggle filter panel on mobile
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  // Format area based on current unit
  const formatArea = (area: number) => {
    return `${area.toLocaleString()} ${areaUnit}`
  }

  // Get unique project names for filter
  const projectNames = useMemo(() => {
    const names = new Set(data?.map((property) => property.projectName) || [])
    return Array.from(names)
  }, [data])

  // Filter properties based on search term and filters
  const filteredProperties2 = useMemo(() => {
    return (
      data?.filter((property) => {
        // Search term filter
        const matchesSearch =
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.projectName.toLowerCase().includes(searchTerm.toLowerCase())

        // Status filter
        const matchesStatus = statusFilter === "all" || property.status === statusFilter

        // Project filter
        const matchesProject = projectFilter === "all" || property.projectName === projectFilter

        return matchesSearch && matchesStatus && matchesProject
      }) || []
    )
  }, [data, searchTerm, statusFilter, projectFilter])

  // Status badge color mapping
  // const getStatusColor2 = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "available":
  //       return "bg-green-100 text-green-800"
  //     case "sold":
  //       return "bg-red-100 text-red-800"
  //     case "reserved":
  //       return "bg-yellow-100 text-yellow-800"
  //     default:
  //       return "bg-gray-100 text-gray-800"
  //   }
  // }

  const getStatusColor3 = (status: string) => {
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

  const handleStatusChange2 = (property: Property, newStatus: string) => {
    // Implement status change functionality here
    // This is a placeholder, replace with your actual logic
    console.log(`Changing status of property ${property.id} to ${newStatus}`)
  }

  // Handle export
  const handleExport = () => {
    alert("Export functionality would go here")
  }

  return (
    <div className="space-y-4">
      {/* Debug info */}
      <div className="text-xs text-muted-foreground">
        Total properties: {data?.length || 0}, Filtered: {filteredProperties.length}, Selected:{" "}
        {selectedProperties.length}
      </div>

      {/* Bulk actions */}
      {selectedProperties.length > 0 && (
        <div className="bg-muted p-4 rounded-md flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-medium">{selectedProperties.length} properties selected</span>
          <div className="flex gap-2">
            <Button size="sm">Bulk Actions</Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedProperties([])}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Properties table */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={filteredProperties.length > 0 && selectedProperties.length === filteredProperties.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Beds</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProperties.includes(property.id)}
                      onCheckedChange={() => togglePropertySelection(property.id)}
                      aria-label={`Select ${property.unitNumber}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{property.unitNumber}</TableCell>
                  <TableCell>{property.projectName}</TableCell>
                  <TableCell>{property.unitType}</TableCell>
                  <TableCell>{property.bedrooms}</TableCell>
                  <TableCell>{property.totalArea ? formatArea(property.totalArea) : "-"}</TableCell>
                  <TableCell>{formatPrice ? formatPrice(property.price) : property.price}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor2(property.status)}>{property.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Mobile filter panel */}
      {/* <div
        className={`fixed inset-0 z-30 bg-background transition-transform transform ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={toggleFilter}>
            <X className="h-5 w-5" />
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
            <Select value={filterProject} onValueChange={setProjectFilter}>
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
            <Select value={filterStatus} onValueChange={setStatusFilter}>
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
      </div> */}

      {/* Main content */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search properties..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                      <Select value={filterProject} onValueChange={setProjectFilter}>
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
                      <Select value={filterStatus} onValueChange={setStatusFilter}>
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

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex gap-1">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "card" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("card")}
              title="Card View"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>

          {/* Always render this div, but conditionally show its contents */}
      {/* <div className="flex gap-2">
            {selectedProperties2.length > 0 && (
              <>
                <Button variant="default" size="sm">
                  Bulk Actions ({selectedProperties2.length})
                </Button>
                <Button variant="outline" size="sm" onClick={openExportDialog}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedProperties([])}>
                  Clear
                </Button>
              </>
            )}
          </div>
        </div>
      </div> */}

      {/* Find the Tabs component and update the TabsList to include all statuses */}
      {/* Find the Tabs component and update the TabsList to exclude the "Sold" tab */}
      {/* <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
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
        </TabsList> */}

      {/* Create a TabsContent for each status */}
      {/* {["all", "Available", "Reserved", "Under Offer", "Sold"].map((status) => (
          <TabsContent key={status} value={status} className="mt-0">
            {viewMode === "list" ? (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={
                            filteredProperties22.length > 0 &&
                            selectedProperties2.length === filteredProperties22.length
                          }
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="hidden md:table-cell">Project</TableHead>
                      <TableHead className="hidden md:table-cell">Phase</TableHead>
                      <TableHead className="hidden md:table-cell">Building</TableHead>
                      <TableHead className="hidden md:table-cell">Floor</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Beds</TableHead>
                      <TableHead className="hidden md:table-cell">Area ({areaUnit})</TableHead>
                      <TableHead className="hidden md:table-cell">Price/{areaUnit}</TableHead>
                      <TableHead className="hidden md:table-cell">Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties22.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-4">
                          No properties found. Try adjusting your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProperties22
                        .filter((property) => {
                          // For the "Sold" tab, only show sold properties
                          if (status === "Sold") return property.status === "Sold"
                          // For the "all" tab, show all properties except sold ones
                          if (status === "all") return true
                          // For other tabs, show properties matching that status
                          return property.status === status
                        })
                        .map((property) => (
                          <TableRow
                            key={property.id}
                            style={{ backgroundColor: getStatusColor(property.status, "bg") }}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedProperties2.includes(property.id)}
                                onCheckedChange={() => togglePropertySelection(property.id)}
                                aria-label={`Select ${property.unitNumber}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{property.unitNumber}</TableCell>
                            <TableCell className="hidden md:table-cell">{property.projectName}</TableCell>
                            <TableCell className="hidden md:table-cell">{property.phase}</TableCell>
                            <TableCell className="hidden md:table-cell">{property.buildingName}</TableCell>
                            <TableCell className="hidden md:table-cell">{property.floorNumber}</TableCell>
                            <TableCell className="hidden md:table-cell">{property.unitType}</TableCell>
                            <TableCell className="hidden md:table-cell">{property.bedrooms}</TableCell>
                            <TableCell className="hidden md:table-cell">{formatArea(property.totalArea)}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {property.totalPricePerSqft
                                ? (formatPrice ? formatPrice(property.totalPricePerSqft) : property.totalPricePerSqft) +
                                  `/${areaUnit}`
                                : "-"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatPrice ? formatPrice(property.price) : property.price}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                style={{
                                  backgroundColor: getStatusColor(property.status, "bg"),
                                  color: getStatusColor(property.status, "text"),
                                  borderColor: getStatusColor(property.status, "border"),
                                }}
                              >
                                {property.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {property.floorPlan && (
                                    <DropdownMenuItem onClick={() => viewFloorPlan(property.floorPlan)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Floor Plan
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => editProperty(property)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openDeleteDialog(property.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange2(property, "Available")}
                                    disabled={property.status === "Available"}
                                  >
                                    Mark as Available
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange2(property, "Reserved")}
                                    disabled={property.status === "Reserved"}
                                  >
                                    Mark as Reserved
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange2(property, "Sold")}
                                    disabled={property.status === "Sold"}
                                  >
                                    Mark as Sold
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange2(property, "Under Offer")}
                                    disabled={property.status === "Under Offer"}
                                  >
                                    Mark as Under Offer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties22.length === 0 ? (
                  <div className="col-span-full text-center py-4">No properties found</div>
                ) : (
                  filteredProperties22.map((property) => (
                    <Card key={property.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{property.unitNumber}</CardTitle>
                            <CardDescription>
                              {property.projectName} - {property.buildingName || ""}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor2(property.status)} variant="outline">
                            {property.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Phase:</p>
                            <p>{property.phase || "Phase 1"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Floor:</p>
                            <p>{property.floorNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Type:</p>
                            <p>{property.unitType}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Beds:</p>
                            <p>{property.bedrooms}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Area:</p>
                            <p>{formatArea(property.totalArea)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Price/sqft:</p>
                            <p>{property.totalPricePerSqft ? `AED ${property.totalPricePerSqft}/sqft` : "-"}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-muted-foreground">Price:</p>
                            <p className="font-medium">AED {property.price?.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end pt-2">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs> */}
    </div>
  )
}
