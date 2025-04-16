"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download, MoreHorizontal, Eye, Edit, Trash2, List, Grid, FileUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

interface Property {
  id: string
  unitNumber: string
  projectName: string
  developerName: string
  buildingName: string
  phase: string
  floorNumber: string
  unitType: string
  bedrooms: number
  bathrooms: number
  internalArea: number
  externalArea: number
  totalArea: number
  price: number
  status: string
  totalPricePerSqft?: number
  floorPlan?: string
}

export default function DevelopmentPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [properties, setProperties] = useState<any[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [selectedExportFields, setSelectedExportFields] = useState<string[]>([])
  const [isFloorPlanDialogOpen, setIsFloorPlanDialogOpen] = useState(false)
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<string | null>(null)
  const [isClientInfoDialogOpen, setIsClientInfoDialogOpen] = useState(false)
  const [propertyToChangeStatus, setPropertyToChangeStatus] = useState<{
    property: any | null
    newStatus: "Available" | "Reserved" | "Sold" | "Under Offer"
    isBulk: boolean
  } | null>(null)
  const [clientInfo, setClientInfo] = useState({
    agencyName: "",
    agentName: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
  })
  const [clientInfoError, setClientInfoError] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [filteredProperties2, setFilteredProperties2] = useState<any[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const [selectedPropertyForReservation, setSelectedPropertyForReservation] = useState<any | null>(null)
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false)

  useEffect(() => {
    loadProperties()
  }, [])

  // Update filtered properties when search query or properties change
  useEffect(() => {
    filterProperties()
  }, [searchQuery, properties, activeTab])

  const loadProperties = () => {
    try {
      setIsLoading(true)
      const savedProperties = localStorage.getItem("properties")
      if (savedProperties) {
        const parsedProperties = JSON.parse(savedProperties)
        setProperties(parsedProperties)
      } else {
        setProperties([])
      }
    } catch (error) {
      console.error("Error loading properties:", error)
      setProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  // Update the filterProperties function to exclude sold units from the "All" tab
  const filterProperties = () => {
    let filtered = [...properties]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.unitNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.developerName?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by status tab
    if (activeTab === "Sold") {
      // Only show sold properties in the Sold tab
      filtered = filtered.filter((property) => property.status === "Sold")
    } else if (activeTab === "all") {
      // In the "All" tab, exclude sold properties
      filtered = filtered.filter((property) => property.status !== "Sold")
    } else {
      // For other tabs, show properties matching that status
      filtered = filtered.filter((property) => property.status === activeTab)
    }

    setFilteredProperties(filtered)
  }

  // Get status color for badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 border-green-300"
      case "Reserved":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Sold":
        return "bg-red-100 text-red-800 border-red-300"
      case "Under Offer":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  // Get row background color based on status
  const getRowBackgroundColor = (status: string): string => {
    switch (status) {
      case "Available":
        return "bg-green-50"
      case "Reserved":
        return "bg-yellow-50"
      case "Sold":
        return "bg-red-50"
      case "Under Offer":
        return "bg-blue-50"
      default:
        return ""
    }
  }

  // Handle property selection for bulk actions
  const togglePropertySelection = (id: string) => {
    setSelectedProperties((prev) => {
      if (prev.includes(id)) {
        return prev.filter((propId) => propId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle select all properties
  const toggleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([])
    } else {
      setSelectedProperties(filteredProperties.map((p) => p.id))
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
  const handleExport = (format: "csv" | "excel") => {
    const selectedPropertiesData = properties.filter((p) => selectedProperties.includes(p.id))

    // Create CSV header
    const header = selectedExportFields.join(",")

    // Create CSV rows
    const rows = selectedPropertiesData.map((item) => {
      return selectedExportFields
        .map((field) => {
          const value = item[field]
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
    link.setAttribute("download", `properties_export.${format === "excel" ? "xlsx" : "csv"}`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsExportDialogOpen(false)
  }

  // Handle floor plan view
  const viewFloorPlan = (floorPlan: string) => {
    setSelectedFloorPlan(floorPlan)
    setIsFloorPlanDialogOpen(true)
  }

  // Handle individual status change
  const handleStatusChange = (property: any, newStatus: "Available" | "Reserved" | "Sold" | "Under Offer") => {
    // Show client info dialog for all status changes except "Available"
    if (newStatus !== "Available") {
      // Need client info for all status changes except Available
      setPropertyToChangeStatus({
        property,
        newStatus,
        isBulk: false,
      })
      setIsClientInfoDialogOpen(true)
    } else {
      // For Available status, change immediately without client info
      try {
        // Get current properties from localStorage
        const savedProperties = localStorage.getItem("properties")
        if (!savedProperties) return

        let updatedProperties = JSON.parse(savedProperties)

        // Update the specific property
        updatedProperties = updatedProperties.map((p: any) =>
          p.id === property.id ? { ...p, status: newStatus, clientInfo: null } : p,
        )

        // Save updated properties back to localStorage
        localStorage.setItem("properties", JSON.stringify(updatedProperties))

        // Update local state
        setProperties(updatedProperties)

        // Refresh the filtered properties
        filterProperties()
      } catch (error) {
        console.error("Error updating property status:", error)
      }
    }
  }

  // Bulk change status
  const bulkChangeStatus = (newStatus: "Available" | "Reserved" | "Sold" | "Under Offer") => {
    if (newStatus !== "Available") {
      // Show client info dialog for all status changes except Available
      setPropertyToChangeStatus({
        property: null,
        newStatus,
        isBulk: true,
      })
      setIsClientInfoDialogOpen(true)
      return
    }

    // For Available status, change immediately without client info
    try {
      // Get current properties from localStorage
      const savedProperties = localStorage.getItem("properties")
      if (!savedProperties) return

      let updatedProperties = JSON.parse(savedProperties)

      // Update all selected properties
      updatedProperties = updatedProperties.map((p: any) =>
        selectedProperties.includes(p.id) ? { ...p, status: newStatus, clientInfo: null } : p,
      )

      // Save updated properties back to localStorage
      localStorage.setItem("properties", JSON.stringify(updatedProperties))

      // Update local state
      setProperties(updatedProperties)

      // Refresh the filtered properties
      filterProperties()

      toast({
        title: "Status updated",
        description: `${selectedProperties.length} properties have been marked as ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating property status:", error)
      toast({
        title: "Error",
        description: "Failed to update property status",
        variant: "destructive",
      })
    }

    setSelectedProperties([])
  }

  // Apply status change with client info
  const applyStatusChangeWithClientInfo = () => {
    setClientInfoError("")

    if (!propertyToChangeStatus) return

    // Validate required fields
    if (!clientInfo.agencyName.trim()) {
      setClientInfoError("Agency Name is required")
      return
    }

    if (!clientInfo.agentName.trim()) {
      setClientInfoError("Agent Name is required")
      return
    }

    if (!clientInfo.clientName.trim()) {
      setClientInfoError("Client Name is required")
      return
    }

    try {
      // Get existing properties from localStorage
      const savedProperties = localStorage.getItem("properties")
      if (!savedProperties) return

      let allProperties = JSON.parse(savedProperties)

      if (propertyToChangeStatus.isBulk) {
        // Bulk update
        allProperties = allProperties.map((p: any) => {
          if (
            selectedProperties.includes(p.id) &&
            (p.status === "Available" || p.status === "Reserved" || p.status === "Under Offer")
          ) {
            return {
              ...p,
              status: propertyToChangeStatus.newStatus,
              clientInfo: { ...clientInfo },
              soldDate:
                propertyToChangeStatus.newStatus === "Sold" ? new Date().toISOString().split("T")[0] : p.soldDate,
            }
          }
          return p
        })
        setSelectedProperties([])
      } else if (propertyToChangeStatus.property) {
        // Single property update
        allProperties = allProperties.map((p: any) => {
          if (p.id === propertyToChangeStatus.property?.id) {
            return {
              ...p,
              status: propertyToChangeStatus.newStatus,
              clientInfo: { ...clientInfo },
              soldDate:
                propertyToChangeStatus.newStatus === "Sold" ? new Date().toISOString().split("T")[0] : p.soldDate,
            }
          }
          return p
        })
      }

      // Save updated properties back to localStorage
      localStorage.setItem("properties", JSON.stringify(allProperties))

      // Update local state
      setProperties(allProperties)

      // Refresh the filtered properties
      filterProperties()

      // Reset and close dialog
      setClientInfo({
        agencyName: "",
        agentName: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
      })
      setIsClientInfoDialogOpen(false)
      setPropertyToChangeStatus(null)
    } catch (error) {
      console.error("Error updating property status:", error)
    }
  }

  // Function to open the reservation dialog
  const openReservationDialog = (property: any) => {
    setSelectedPropertyForReservation(property)
    setIsReservationDialogOpen(true)
  }

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

  const editProperty = (property: Property) => {
    setCurrentProperty(property)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (propertyId: string) => {
    setPropertyToDelete(propertyId)
    setIsDeleteDialogOpen(true)
  }

  const handleStatusChange2 = (property: any, newStatus: "Available" | "Reserved" | "Sold" | "Under Offer") => {
    handleStatusChange(property, newStatus)
  }

  return (
   <div className="p-8">
     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
       <div>
         <h1 className="text-3xl font-bold tracking-tight">Development</h1>
         <p className="text-muted-foreground">Manage your development inventory</p>
       </div>
       <div className="flex flex-col sm:flex-row gap-2">
         <Button onClick={() => router.push("/dashboard/properties/add")}>
           <Plus className="mr-2 h-4 w-4" />
           Add Unit
         </Button>
         <Button variant="outline" onClick={() => router.push("/dashboard/properties/import")}>
           <FileUp className="mr-2 h-4 w-4" />
           Import
         </Button>
       </div>
     </div>

     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
       <div className="flex gap-4 w-full sm:w-auto">
         <div className="relative flex-1 sm:w-[300px]">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input
             type="search"
             placeholder="Search properties..."
             className="w-full pl-8"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
         </div>
       </div>

       <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
         <div className="flex gap-1">
           <Button
             variant={viewMode === "list" ? "default" : "outline"}
             size="icon"
             onClick={() => setViewMode("list")}
             className="rounded-l-md rounded-r-none"
           >
             <List className="h-4 w-4" />
           </Button>
           <Button
             variant={viewMode === "card" ? "default" : "outline"}
             size="icon"
             onClick={() => setViewMode("card")}
             className="rounded-l-none rounded-r-md"
           >
             <Grid className="h-4 w-4" />
           </Button>
         </div>

         <Button variant="outline" size="sm" className="flex gap-1" onClick={openExportDialog}>
           <Download className="h-4 w-4 mr-1" />
           <span>Export</span>
         </Button>
       </div>
     </div>

     <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
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

       <TabsContent value={activeTab} className="mt-0">
         {isLoading ? (
           <Card>
             <CardContent className="p-6">
               <div className="flex justify-center items-center h-40">
                 <p>Loading inventory...</p>
               </div>
             </CardContent>
           </Card>
         ) : (
           <div>
             {/* Bulk actions */}
             {selectedProperties.length > 0 && (
               <div className="bg-muted p-4 rounded-md flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
                 <span className="font-medium">{selectedProperties.length} properties selected</span>
                 <div className="flex gap-2">
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button size="sm">Bulk Actions</Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                       <DropdownMenuItem
                         onClick={() => bulkChangeStatus("Available")}
                         disabled={selectedProperties.every((id) => {
                           const property = properties.find((p) => p.id === id)
                           return property?.status === "Available"
                         })}
                       >
                         Mark as Available
                       </DropdownMenuItem>
                       <DropdownMenuItem
                         onClick={() => bulkChangeStatus("Reserved")}
                         disabled={selectedProperties.every((id) => {
                           const property = properties.find((p) => p.id === id)
                           return property?.status === "Reserved"
                         })}
                       >
                         Mark as Reserved
                       </DropdownMenuItem>
                       <DropdownMenuItem
                         onClick={() => bulkChangeStatus("Sold")}
                         disabled={selectedProperties.every((id) => {
                           const property = properties.find((p) => p.id === id)
                           return property?.status === "Sold"
                         })}
                       >
                         Mark as Sold
                       </DropdownMenuItem>
                       <DropdownMenuItem
                         onClick={() => bulkChangeStatus("Under Offer")}
                         disabled={selectedProperties.every((id) => {
                           const property = properties.find((p) => p.id === id)
                           return property?.status === "Under Offer"
                         })}
                       >
                         Mark as Under Offer
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                   <Button variant="outline" size="sm" onClick={openExportDialog}>
                     <Download className="h-4 w-4 mr-1" />
                     Export
                   </Button>
                   <Button variant="outline" size="sm" onClick={() => setSelectedProperties([])}>
                     Clear Selection
                   </Button>
                 </div>
               </div>
             )}
             {viewMode === "list" ? (
               <div className="rounded-md border overflow-x-auto">
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead className="w-[50px]">
                         <Checkbox
                           checked={
                             filteredProperties.length > 0 && selectedProperties.length === filteredProperties.length
                           }
                           onCheckedChange={toggleSelectAll}
                           aria-label="Select all"
                         />
                       </TableHead>
                       <TableHead>Unit</TableHead>
                       <TableHead>Project</TableHead>
                       <TableHead>Phase</TableHead>
                       <TableHead>Building</TableHead>
                       <TableHead>Floor</TableHead>
                       <TableHead>Type</TableHead>
                       <TableHead>Beds</TableHead>
                       <TableHead>Area (sqft)</TableHead>
                       <TableHead>Price/sqft</TableHead>
                       <TableHead>Price</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {filteredProperties.length === 0 ? (
                       <TableRow>
                         <TableCell colSpan={13} className="text-center py-4">
                           No properties found
                         </TableCell>
                       </TableRow>
                     ) : (
                       filteredProperties.map((property) => (
                         <TableRow key={property.id} className={getRowBackgroundColor(property.status)}>
                           <TableCell>
                             <Checkbox
                               checked={selectedProperties.includes(property.id)}
                               onCheckedChange={() => togglePropertySelection(property.id)}
                               aria-label={`Select ${property.unitNumber}`}
                             />
                           </TableCell>
                           <TableCell className="font-medium">{property.unitNumber}</TableCell>
                           <TableCell>{property.projectName}</TableCell>
                           <TableCell>{property.phase || "Phase 1"}</TableCell>
                           <TableCell>{property.buildingName}</TableCell>
                           <TableCell>{property.floorNumber}</TableCell>
                           <TableCell>{property.unitType}</TableCell>
                           <TableCell>{property.bedrooms}</TableCell>
                           <TableCell>{property.totalArea || property.area} sqft</TableCell>
                           <TableCell>
                             {property.totalPricePerSqft
                               ? `AED ${property.totalPricePerSqft}/sqft`
                               : "-"}
                           </TableCell>
                           <TableCell>AED {property.price?.toLocaleString()}</TableCell>
                           <TableCell>
                             <Badge className={getStatusColor(property.status)}>{property.status}</Badge>
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
                                 <DropdownMenuItem
                                   onClick={() => router.push(`/dashboard/properties/edit/${property.id}`)}
                                 >
                                   <Edit className="mr-2 h-4 w-4" />
                                   Edit
                                 </DropdownMenuItem>
                                 <DropdownMenuItem>
                                   <Trash2 className="mr-2 h-4 w-4" />
                                   Delete
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                   onClick={() => handleStatusChange(property, "Available")}
                                   disabled={property.status === "Available"}
                                 >
                                   Mark as Available
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                   onClick={() => handleStatusChange(property, "Reserved")}
                                   disabled={property.status === "Reserved"}
                                 >
                                   Mark as Reserved
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                   onClick={() => handleStatusChange(property, "Sold")}
                                   disabled={property.status === "Sold"}
                                 >
                                   Mark as Sold
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                   onClick={() => handleStatusChange(property, "Under Offer")}
                                   disabled={property.status === "Under Offer"}
                                 >
                                   Mark as Under Offer
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                   onClick={() => {
                                     setSelectedPropertyForReservation(property)
                                     setIsReservationDialogOpen(true)
                                   }}
                                   disabled={property.status !== "Reserved"}
                                 >
                                   Generate Reservation Deed
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
                 {filteredProperties.length === 0 ? (
                   <div className="col-span-full text-center py-4">No properties found</div>
                 ) : (
                   filteredProperties.map((property) => (
                     <Card key={property.id} className={getRowBackgroundColor(property.status)}>
                       <CardHeader className="pb-2">
                         <div className="flex justify-between items-start">
                           <div>
                             <CardTitle className="text-lg">{property.unitNumber}</CardTitle>
                             <CardDescription>
                               {property.projectName} - {property.buildingName || ""}
                             </CardDescription>
                           </div>
                           <Checkbox
                             checked={selectedProperties.includes(property.id)}
                             onCheckedChange={() => togglePropertySelection(property.id)}
                             aria-label={`Select ${property.unitNumber}`}
                           />
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
                             <p>{property.totalArea || property.area} sqft</p>
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
                       <CardFooter className="flex justify-between pt-2">
                         <Badge className={getStatusColor2(property.status)}>{property.status}</Badge>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon">
                               <MoreHorizontal className="h-4 w-4" />
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
                       </CardFooter>
                     </Card>
                   ))
                 )}
               </div>
             )}
           </div>
         </TabsContent>
       </Tabs>
     </Dialog>
  </div>
 )
}
