"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Download, MoreHorizontal, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ClientDetailsDialog, type ClientDetails } from "@/components/client-details-dialog"

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
    clientDetails: null,
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
    clientDetails: null,
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
    clientDetails: {
      clientName: "John Smith",
      clientEmail: "john@example.com",
      agencyName: "City Realty",
      agentName: "Mike Johnson",
    },
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
    clientDetails: null,
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
    clientDetails: {
      clientName: "Sarah Williams",
      clientEmail: "sarah@example.com",
      agencyName: "Luxury Properties",
      agentName: "David Roberts",
    },
  },
]

// Status that require client details
const statusesRequiringClientDetails = ["Reserved", "Under Offer", "Sold"]

export default function PropertiesClient() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("Available")
  const { toast } = useToast()

  // Client details dialog state
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
  const [statusChangeAction, setStatusChangeAction] = useState<{
    type: "single" | "bulk"
    id?: string
    status: string
  } | null>(null)

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

  // Toggle property selection
  const togglePropertySelection = (id: string) => {
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
      setSelectedProperties([])
    } else {
      setSelectedProperties(filteredProperties.map((p) => p.id))
    }
  }

  // Initiate bulk status change
  const initiateBulkStatusChange = () => {
    // If selected status requires client details, open client dialog
    if (statusesRequiringClientDetails.includes(selectedStatus)) {
      setStatusChangeAction({
        type: "bulk",
        status: selectedStatus,
      })
      setIsClientDialogOpen(true)
    } else {
      // Otherwise, proceed with status change directly
      handleBulkStatusChange()
    }
  }

  // Handle bulk status change
  const handleBulkStatusChange = (clientDetails?: ClientDetails) => {
    try {
      const updatedProperties = properties.map((property) => {
        if (selectedProperties.includes(property.id)) {
          return {
            ...property,
            status: selectedStatus,
            // Add client details if provided
            ...(clientDetails ? { clientDetails } : {}),
          }
        }
        return property
      })

      setProperties(updatedProperties)

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("properties", JSON.stringify(updatedProperties))
      }

      setIsStatusDialogOpen(false)
      setSelectedProperties([])

      toast({
        title: "Status updated",
        description: `Updated ${selectedProperties.length} properties to ${selectedStatus}`,
      })
    } catch (err) {
      console.error("Error updating status:", err)
      toast({
        title: "Error",
        description: "Failed to update property status",
        variant: "destructive",
      })
    }
  }

  // Initiate quick status change
  const initiateQuickStatusChange = (id: string, newStatus: string) => {
    // If status requires client details, open client dialog
    if (statusesRequiringClientDetails.includes(newStatus)) {
      setStatusChangeAction({
        type: "single",
        id,
        status: newStatus,
      })
      setIsClientDialogOpen(true)
    } else {
      // Otherwise, proceed with status change directly
      handleQuickStatusChange(id, newStatus)
    }
  }

  // Handle client details submission
  const handleClientDetailsSubmit = (details: ClientDetails) => {
    if (!statusChangeAction) return

    if (statusChangeAction.type === "single" && statusChangeAction.id) {
      // Apply to single property
      const updatedProperties = properties.map((property) => {
        if (property.id === statusChangeAction.id) {
          return {
            ...property,
            status: statusChangeAction.status,
            clientDetails: details,
          }
        }
        return property
      })

      // Update state and localStorage
      setProperties(updatedProperties)
      localStorage.setItem("properties", JSON.stringify(updatedProperties))

      toast({
        title: "Status updated",
        description: `Property status changed to ${statusChangeAction.status}`,
      })
    } else if (statusChangeAction.type === "bulk") {
      // Apply to multiple properties
      const updatedProperties = properties.map((property) => {
        if (selectedProperties.includes(property.id)) {
          return {
            ...property,
            status: statusChangeAction.status,
            clientDetails: details,
          }
        }
        return property
      })

      // Update state and localStorage
      setProperties(updatedProperties)
      localStorage.setItem("properties", JSON.stringify(updatedProperties))

      toast({
        title: "Status updated",
        description: `Updated ${selectedProperties.length} properties to ${statusChangeAction.status}`,
      })

      // Clear selections after bulk update
      setSelectedProperties([])
      setIsStatusDialogOpen(false)
    }

    // Close dialog and reset action
    setIsClientDialogOpen(false)
    setStatusChangeAction(null)
  }

  // Quick edit property status (for statuses that don't require client details)
  const handleQuickStatusChange = (id: string, newStatus: string) => {
    try {
      const updatedProperties = properties.map((property) => {
        if (property.id === id) {
          // If changing to Available, remove client details
          if (newStatus === "Available") {
            return {
              ...property,
              status: newStatus,
              clientDetails: null,
            }
          } else {
            return {
              ...property,
              status: newStatus,
            }
          }
        }
        return property
      })

      // Update state and localStorage directly
      setProperties(updatedProperties)
      localStorage.setItem("properties", JSON.stringify(updatedProperties))

      toast({
        title: "Status updated",
        description: `Property status changed to ${newStatus}`,
      })
    } catch (err) {
      console.error("Error updating status:", err)
      toast({
        title: "Error",
        description: "Failed to update property status",
        variant: "destructive",
      })
    }
  }

  // Handle client dialog cancel
  const handleClientDialogCancel = () => {
    setIsClientDialogOpen(false)
    setStatusChangeAction(null)
  }

  // Export to Excel
  const exportToExcel = () => {
    try {
      // Get properties to export (either selected or all)
      const propertiesToExport =
        selectedProperties.length > 0 ? properties.filter((p) => selectedProperties.includes(p.id)) : properties

      // Create CSV header
      const headers = [
        "Unit Number",
        "Project",
        "Type",
        "Beds",
        "Baths",
        "Area (sqft)",
        "Price",
        "Status",
        "Location",
        "Client Name",
        "Client Email",
        "Agency Name",
        "Agent Name",
      ]

      // Create CSV rows
      const rows = propertiesToExport.map((p) => [
        p.unitNumber,
        p.projectName,
        p.unitType,
        p.bedrooms,
        p.bathrooms,
        p.totalArea,
        p.price,
        p.status,
        p.location,
        p.clientDetails?.clientName || "",
        p.clientDetails?.clientEmail || "",
        p.clientDetails?.agencyName || "",
        p.clientDetails?.agentName || "",
      ])

      // Combine header and rows
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", "properties_export.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export complete",
        description: `Exported ${propertiesToExport.length} properties to Excel format`,
      })
    } catch (err) {
      console.error("Error exporting data:", err)
      toast({
        title: "Error",
        description: "Failed to export properties",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your property inventory</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/dashboard/properties/add")}>Add Property</Button>
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex justify-between items-center">
        <Input
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        {selectedProperties.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{selectedProperties.length} selected</span>
            <Button variant="outline" size="sm" onClick={() => setIsStatusDialogOpen(true)}>
              Change Status
            </Button>
          </div>
        )}
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
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          selectedProperties.length === filteredProperties.length && filteredProperties.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Beds</TableHead>
                    <TableHead>Area (sqft)</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Client/Agent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProperties.includes(property.id)}
                          onCheckedChange={() => togglePropertySelection(property.id)}
                        />
                      </TableCell>
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
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {property.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {property.clientDetails ? (
                          <span className="text-xs">
                            {property.clientDetails.clientName} / {property.clientDetails.agentName}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/properties/edit/${property.id}`)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(property.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <span className="font-medium">Change Status</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => initiateQuickStatusChange(property.id, "Available")}>
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                Available
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => initiateQuickStatusChange(property.id, "Reserved")}>
                                <Check className="mr-2 h-4 w-4 text-blue-600" />
                                Reserved
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => initiateQuickStatusChange(property.id, "Under Offer")}>
                                <Check className="mr-2 h-4 w-4 text-yellow-600" />
                                Under Offer
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => initiateQuickStatusChange(property.id, "Sold")}>
                                <Check className="mr-2 h-4 w-4 text-red-600" />
                                Sold
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Bulk Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Property Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedProperties.length} selected properties.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
                <SelectItem value="Under Offer">Under Offer</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={initiateBulkStatusChange}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client Details Dialog */}
      {statusChangeAction && (
        <ClientDetailsDialog
          open={isClientDialogOpen}
          onOpenChange={setIsClientDialogOpen}
          onSubmit={handleClientDetailsSubmit}
          onCancel={handleClientDialogCancel}
          status={statusChangeAction.status}
        />
      )}
    </div>
  )
}
