"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Edit, Trash2, Download } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { deleteProperty } from "@/utils/storage-utils"
import { PencilIcon } from "@radix-ui/react-icons"

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
  link.setAttribute("download", `${filename}.csv`)
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
  const router = useRouter()
  const { toast } = useToast()
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

  // Handle edit property
  const handleEditProperty = (id: string) => {
    router.push(`/dashboard/properties/edit/${id}`)
  }

  // Handle delete property
  const handleDeleteProperty = (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      const success = deleteProperty(id)
      if (success) {
        toast({
          title: "Property deleted",
          description: "The property has been successfully deleted.",
        })
        if (onDataChange) {
          onDataChange()
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete property",
          variant: "destructive",
        })
      }
    }
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedProperties.length === 0) {
      toast({
        title: "No properties selected",
        description: "Please select at least one property to delete.",
        variant: "destructive",
      })
      return
    }

    if (confirm(`Are you sure you want to delete ${selectedProperties.length} properties?`)) {
      let success = true
      selectedProperties.forEach((id) => {
        const result = deleteProperty(id)
        if (!result) success = false
      })

      if (success) {
        toast({
          title: "Properties deleted",
          description: `${selectedProperties.length} properties have been successfully deleted.`,
        })
        setSelectedProperties([])
        if (onDataChange) {
          onDataChange()
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete some properties",
          variant: "destructive",
        })
      }
    }
  }

  // Handle export
  const handleExport = (format: "csv" | "excel") => {
    const selectedPropertiesData = filteredProperties.filter((p) => selectedProperties.includes(p.id))

    if (selectedPropertiesData.length === 0) {
      toast({
        title: "No properties selected",
        description: "Please select at least one property to export.",
        variant: "destructive",
      })
      return
    }

    if (format === "csv") {
      exportToCSV(selectedPropertiesData, exportFields, "properties_export")
    } else {
      exportToExcel(selectedPropertiesData, exportFields, "properties_export")
    }

    toast({
      title: "Export complete",
      description: `${selectedPropertiesData.length} properties have been exported.`,
    })
  }

  // Format area based on current unit
  const formatArea = (area: number) => {
    if (!area) return "-"
    return `${area.toLocaleString()} ${areaUnit}`
  }

  const handleBulkAction = (action: string) => {
    const selectedIds = filteredProperties.filter((p) => selectedProperties.includes(p.id)).map((p) => p.id)

    if (selectedIds.length === 0) {
      toast({
        title: "No properties selected",
        description: "Please select at least one property to perform this action.",
        variant: "destructive",
      })
      return
    }

    switch (action) {
      case "delete":
        // Delete selected properties
        let success = true
        selectedIds.forEach((id) => {
          const result = deleteProperty(id)
          if (!result) success = false
        })

        if (success) {
          toast({
            title: "Properties deleted",
            description: `${selectedIds.length} properties have been deleted.`,
          })
          setSelectedProperties([])
          if (onDataChange) {
            onDataChange()
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to delete some properties",
            variant: "destructive",
          })
        }
        break
      // Add other bulk actions as needed
      default:
        break
    }
  }

  return (
    <div className="space-y-4">
      {/* Bulk actions */}
      {selectedProperties.length > 0 && (
        <div className="bg-muted p-4 rounded-md flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-medium">{selectedProperties.length} properties selected</span>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">Bulk Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                onCheckedChange={() => toggleSelectAll()}
              />
            </TableHead>
            <TableHead>Unit Number</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Area</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProperties.map((property: Property) => (
            <TableRow key={property.id}>
              <TableCell className="font-medium">
                <Checkbox
                  checked={selectedProperties.includes(property.id)}
                  onCheckedChange={() => togglePropertySelection(property.id)}
                />
              </TableCell>
              <TableCell>{property.unitNumber}</TableCell>
              <TableCell>{property.projectName}</TableCell>
              <TableCell>
                <Badge className={getStatusColor2(property.status)}>{property.status}</Badge>
              </TableCell>
              <TableCell>{formatPrice ? formatPrice(property.price) : property.price}</TableCell>
              <TableCell>{formatArea(property.totalArea)}</TableCell>
              <TableCell className="text-right font-medium">
                <div className="flex justify-end gap-4">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/dashboard/properties/edit/${property.id}`)}
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditProperty(property.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteProperty(property.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredProperties.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No properties found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
