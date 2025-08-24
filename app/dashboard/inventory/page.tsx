"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Edit,
  Trash2,
  X,
  Search,
  Eye,
  Filter,
  Upload,
  Download,
  MoreHorizontal,
  Calculator,
  FileText,
  Lock,
} from "lucide-react"
import { PaymentPlanGenerator } from "@/components/payment-plan-generator"
import { PropertyEditDialog } from "@/components/property-edit-dialog"
import { StatusChangeDialog } from "@/components/status-change-dialog"
import { BulkStatusDialog } from "@/components/bulk-status-dialog"

// Complete property interface
interface Property {
  id: number
  unitNumber: string
  projectName: string
  towerName: string
  type: string
  location: string
  internalArea: number
  externalArea: number
  totalArea: number
  price: number
  status: "Available" | "Reserved" | "Sold" | "Blocked" | "Developer Hold"
  phase: string
  bedrooms: number
  bathrooms: number
  floor: number
  view: string
  internalTag: boolean
  externalTag: boolean
  priceHistory?: Array<{
    id: string
    propertyId: number
    oldPrice: number
    newPrice: number
    changeDate: string
    changedBy: string
    changeReason: string
  }>
  salesOfferFile?: string
  salesOfferUploadDate?: string
  salesOfferVersion?: string
  reservedBy?: string
  reservedDate?: string
  soldBy?: string
  soldDate?: string
  soldPrice?: number
  saleType?: "christies" | "external_agency"
  externalAgencyName?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  notes?: string
}

// Complete mock data
const mockProperties: Property[] = [
  {
    id: 1,
    unitNumber: "V-A1-001",
    projectName: "Luxury Villa A1",
    towerName: "Tower A",
    type: "Villa",
    location: "Palm Jumeirah, Dubai",
    internalArea: 5000,
    externalArea: 2000,
    totalArea: 7000,
    price: 18365000,
    status: "Available",
    phase: "Phase 1",
    bedrooms: 5,
    bathrooms: 6,
    floor: 1,
    view: "Sea View",
    internalTag: true,
    externalTag: true,
    priceHistory: [
      {
        id: "1",
        propertyId: 1,
        oldPrice: 18000000,
        newPrice: 18365000,
        changeDate: "2024-01-10T10:30:00Z",
        changedBy: "Admin User",
        changeReason: "Market adjustment",
      },
    ],
  },
  {
    id: 2,
    unitNumber: "A-B2-1502",
    projectName: "Modern Apartment B2",
    towerName: "Tower B",
    type: "Apartment",
    location: "Dubai Marina",
    internalArea: 1200,
    externalArea: 100,
    totalArea: 1300,
    price: 1600000,
    status: "Reserved",
    phase: "Phase 2",
    bedrooms: 2,
    bathrooms: 2,
    floor: 15,
    view: "Marina View",
    internalTag: true,
    externalTag: false,
    reservedBy: "Ahmed Al-Rashid",
    reservedDate: "2024-01-15",
    saleType: "christies",
    clientName: "John Smith",
    clientEmail: "john.smith@email.com",
    clientPhone: "+971 50 123 4567",
    priceHistory: [
      {
        id: "2",
        propertyId: 2,
        oldPrice: 1550000,
        newPrice: 1600000,
        changeDate: "2024-01-08T14:15:00Z",
        changedBy: "Internal Agent",
        changeReason: "Competitive pricing",
      },
    ],
  },
  {
    id: 3,
    unitNumber: "C-C3-0501",
    projectName: "Commercial Space C3",
    towerName: "Tower C",
    type: "Commercial",
    location: "Business Bay, Dubai",
    internalArea: 3000,
    externalArea: 0,
    totalArea: 3000,
    price: 5000000,
    status: "Sold",
    phase: "Developer Holding",
    bedrooms: 0,
    bathrooms: 2,
    floor: 5,
    view: "City View",
    internalTag: false,
    externalTag: true,
    soldBy: "Sarah Johnson",
    soldDate: "2024-01-10",
    soldPrice: 4800000,
    saleType: "external_agency",
    externalAgencyName: "Dubai Properties LLC",
    clientName: "Ahmed Al-Mansouri",
    clientEmail: "ahmed@company.ae",
    clientPhone: "+971 50 987 6543",
    notes: "Sold to corporate client",
  },
  {
    id: 4,
    unitNumber: "P-D4-2201",
    projectName: "Penthouse D4",
    towerName: "Tower D",
    type: "Penthouse",
    location: "Downtown Dubai",
    internalArea: 4500,
    externalArea: 1500,
    totalArea: 6000,
    price: 25000000,
    status: "Available",
    phase: "Phase 3",
    bedrooms: 4,
    bathrooms: 5,
    floor: 22,
    view: "Burj Khalifa View",
    internalTag: true,
    externalTag: true,
  },
  {
    id: 5,
    unitNumber: "S-E5-0102",
    projectName: "Studio E5",
    towerName: "Tower E",
    type: "Studio",
    location: "Jumeirah Village Circle",
    internalArea: 500,
    externalArea: 50,
    totalArea: 550,
    price: 650000,
    status: "Blocked",
    phase: "Phase 1",
    bedrooms: 0,
    bathrooms: 1,
    floor: 1,
    view: "Garden View",
    internalTag: true,
    externalTag: true,
  },
  {
    id: 6,
    unitNumber: "T-F6-1203",
    projectName: "Townhouse F6",
    towerName: "Tower F",
    type: "Townhouse",
    location: "Arabian Ranches",
    internalArea: 2500,
    externalArea: 800,
    totalArea: 3300,
    price: 3200000,
    status: "Developer Hold",
    phase: "Phase 2",
    bedrooms: 3,
    bathrooms: 4,
    floor: 12,
    view: "Golf View",
    internalTag: true,
    externalTag: true,
  },
]

export default function InventoryPage() {
  const [mounted, setMounted] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperties, setSelectedProperties] = useState<number[]>([])
  const [globalSearch, setGlobalSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none")
  const [bedroomFilter, setBedroomFilter] = useState("all")
  const [floorFilter, setFloorFilter] = useState("")
  const [viewFilter, setViewFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [phaseFilter, setPhaseFilter] = useState("all")
  const [priceRangeMin, setPriceRangeMin] = useState("")
  const [priceRangeMax, setPriceRangeMax] = useState("")
  const [areaRangeMin, setAreaRangeMin] = useState("")
  const [areaRangeMax, setAreaRangeMax] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPaymentPlanDialog, setShowPaymentPlanDialog] = useState(false)
  const [selectedPropertyForPayment, setSelectedPropertyForPayment] = useState<Property | null>(null)

  // Status change dialog states
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [statusDialogType, setStatusDialogType] = useState<"Reserved" | "Sold">("Reserved")
  const [selectedPropertyForStatus, setSelectedPropertyForStatus] = useState<Property | null>(null)
  const [showBulkStatusDialog, setShowBulkStatusDialog] = useState(false)

  // Initialize data safely
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 100))
        setProperties(mockProperties)
        setMounted(true)
      } catch (err) {
        console.error("Error initializing data:", err)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Safe formatting functions
  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency: "AED",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount || 0)
    } catch {
      return `AED ${amount || 0}`
    }
  }

  const formatArea = (area: number): string => {
    try {
      return new Intl.NumberFormat("en-AE", { maximumFractionDigits: 2 }).format(area || 0)
    } catch {
      return String(area || 0)
    }
  }

  const getStatusColor = (status: Property["status"]): string => {
    const colors = {
      Available: "bg-green-100 text-green-800",
      Reserved: "bg-blue-100 text-blue-800",
      Sold: "bg-red-100 text-red-800",
      Blocked: "bg-yellow-100 text-yellow-800",
      "Developer Hold": "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  // Get row styling based on status
  const getRowStyling = (status: Property["status"]): string => {
    const styles = {
      Available: "hover:bg-gray-50",
      Reserved: "bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-400",
      Sold: "bg-red-50 hover:bg-red-100 border-l-4 border-red-400 opacity-75",
      Blocked: "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-400",
      "Developer Hold": "bg-gray-50 hover:bg-gray-100 border-l-4 border-gray-400",
    }
    return styles[status] || "hover:bg-gray-50"
  }

  // Check if property can be edited
  const canEditProperty = (property: Property): boolean => {
    return property.status !== "Sold"
  }

  // Check if property can change status
  const canChangeStatus = (property: Property): boolean => {
    return property.status !== "Sold"
  }

  // Get available status options for a property
  const getAvailableStatusOptions = (currentStatus: Property["status"]) => {
    if (currentStatus === "Sold") return []

    const allStatuses = ["Available", "Reserved", "Sold", "Blocked", "Developer Hold"]
    return allStatuses.filter((status) => status !== currentStatus)
  }

  // Safe event handlers
  const handleSelectProperty = (propertyId: number, checked: boolean) => {
    try {
      const property = properties.find((p) => p.id === propertyId)
      if (property?.status === "Sold") return // Don't allow selection of sold properties

      if (checked) {
        setSelectedProperties((prev) => [...prev, propertyId])
      } else {
        setSelectedProperties((prev) => prev.filter((id) => id !== propertyId))
      }
    } catch (err) {
      console.error("Error selecting property:", err)
    }
  }

  const handleDelete = (propertyId: number) => {
    try {
      const property = properties.find((p) => p.id === propertyId)
      if (property?.status === "Sold") {
        alert("Cannot delete sold properties")
        return
      }

      if (confirm("Are you sure you want to delete this property?")) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyId))
        setSelectedProperties((prev) => prev.filter((id) => id !== propertyId))
      }
    } catch (err) {
      console.error("Error deleting property:", err)
    }
  }

  const clearAllFilters = () => {
    try {
      setGlobalSearch("")
      setStatusFilter("all")
      setPriceSort("none")
      setBedroomFilter("all")
      setFloorFilter("")
      setViewFilter("all")
      setTypeFilter("all")
      setPhaseFilter("all")
      setPriceRangeMin("")
      setPriceRangeMax("")
      setAreaRangeMin("")
      setAreaRangeMax("")
    } catch (err) {
      console.error("Error clearing filters:", err)
    }
  }

  const handleEdit = (property: Property) => {
    try {
      if (!canEditProperty(property)) {
        alert("Sold properties cannot be edited")
        return
      }
      setEditingProperty(property)
      setShowEditDialog(true)
    } catch (err) {
      console.error("Error opening edit dialog:", err)
    }
  }

  const handleSaveEdit = (updatedProperty: Property) => {
    try {
      setProperties((prev) => prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p)))
      setShowEditDialog(false)
      setEditingProperty(null)
    } catch (err) {
      console.error("Error saving property:", err)
    }
  }

  const handlePaymentPlan = (property: Property) => {
    try {
      setSelectedPropertyForPayment(property)
      setShowPaymentPlanDialog(true)
    } catch (err) {
      console.error("Error opening payment plan:", err)
    }
  }

  // Status change handlers
  const handleMarkAsReserved = (property: Property) => {
    try {
      if (!canChangeStatus(property)) {
        alert("Cannot change status of sold properties")
        return
      }
      setSelectedPropertyForStatus(property)
      setStatusDialogType("Reserved")
      setShowStatusDialog(true)
    } catch (err) {
      console.error("Error opening reserved dialog:", err)
    }
  }

  const handleMarkAsSold = (property: Property) => {
    try {
      if (!canChangeStatus(property)) {
        alert("Cannot change status of sold properties")
        return
      }
      setSelectedPropertyForStatus(property)
      setStatusDialogType("Sold")
      setShowStatusDialog(true)
    } catch (err) {
      console.error("Error opening sold dialog:", err)
    }
  }

  const handleStatusChange = (data: any) => {
    try {
      if (!selectedPropertyForStatus) return

      const updatedProperty: Property = {
        ...selectedPropertyForStatus,
        status: statusDialogType,
        ...(statusDialogType === "Reserved" && {
          reservedBy: data.agentName,
          reservedDate: data.date,
          saleType: data.saleType,
          externalAgencyName: data.externalAgencyName,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone,
          notes: data.notes,
        }),
        ...(statusDialogType === "Sold" && {
          soldBy: data.agentName,
          soldDate: data.date,
          soldPrice: data.finalPrice ? Number.parseFloat(data.finalPrice) : undefined,
          saleType: data.saleType,
          externalAgencyName: data.externalAgencyName,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone,
          notes: data.notes,
        }),
      }

      setProperties((prev) => prev.map((p) => (p.id === selectedPropertyForStatus.id ? updatedProperty : p)))
      setSelectedPropertyForStatus(null)
    } catch (err) {
      console.error("Error updating property status:", err)
    }
  }

  const handleBulkStatusUpdate = () => {
    try {
      if (selectedProperties.length === 0) return

      // Check if any selected properties are sold
      const soldProperties = properties.filter((p) => selectedProperties.includes(p.id) && p.status === "Sold")
      if (soldProperties.length > 0) {
        alert("Cannot change status of sold properties. Please deselect sold properties first.")
        return
      }

      setShowBulkStatusDialog(true)
    } catch (err) {
      console.error("Error opening bulk status dialog:", err)
    }
  }

  const handleBulkStatusChange = (status: Property["status"], data?: any) => {
    try {
      setProperties((prev) =>
        prev.map((property) => {
          if (!selectedProperties.includes(property.id) || property.status === "Sold") return property

          const updatedProperty: Property = {
            ...property,
            status,
          }

          if (data && (status === "Reserved" || status === "Sold")) {
            if (status === "Reserved") {
              updatedProperty.reservedBy = data.agentName
              updatedProperty.reservedDate = data.date
              updatedProperty.saleType = data.saleType
              updatedProperty.externalAgencyName = data.externalAgencyName
              updatedProperty.clientName = data.clientName
              updatedProperty.clientEmail = data.clientEmail
              updatedProperty.clientPhone = data.clientPhone
              updatedProperty.notes = data.notes
            } else if (status === "Sold") {
              updatedProperty.soldBy = data.agentName
              updatedProperty.soldDate = data.date
              updatedProperty.soldPrice = data.finalPrice ? Number.parseFloat(data.finalPrice) : undefined
              updatedProperty.saleType = data.saleType
              updatedProperty.externalAgencyName = data.externalAgencyName
              updatedProperty.clientName = data.clientName
              updatedProperty.clientEmail = data.clientEmail
              updatedProperty.clientPhone = data.clientPhone
              updatedProperty.notes = data.notes
            }
          }

          return updatedProperty
        }),
      )

      setSelectedProperties([])
    } catch (err) {
      console.error("Error updating bulk status:", err)
    }
  }

  // Safe filtering
  const safeToLowerCase = (value: any): string => {
    try {
      if (value === null || value === undefined) return ""
      return String(value).toLowerCase()
    } catch {
      return ""
    }
  }

  // Filter and sort properties
  const filteredProperties = (() => {
    try {
      return properties
        .filter((property) => {
          try {
            const searchTerm = globalSearch.toLowerCase()
            const searchAllowed =
              globalSearch === "" ||
              safeToLowerCase(property.unitNumber).includes(searchTerm) ||
              safeToLowerCase(property.projectName).includes(searchTerm) ||
              safeToLowerCase(property.towerName).includes(searchTerm) ||
              safeToLowerCase(property.type).includes(searchTerm) ||
              safeToLowerCase(property.view).includes(searchTerm) ||
              safeToLowerCase(property.location).includes(searchTerm) ||
              safeToLowerCase(property.phase).includes(searchTerm)

            const statusAllowed = statusFilter === "all" || property.status === statusFilter
            const bedroomAllowed = bedroomFilter === "all" || (property.bedrooms || 0).toString() === bedroomFilter
            const floorAllowed = floorFilter === "" || (property.floor || 0).toString().includes(floorFilter)
            const viewAllowed =
              viewFilter === "all" || safeToLowerCase(property.view).includes(safeToLowerCase(viewFilter))
            const typeAllowed = typeFilter === "all" || property.type === typeFilter
            const phaseAllowed = phaseFilter === "all" || property.phase === phaseFilter

            const priceMin = priceRangeMin ? Number.parseFloat(priceRangeMin) : 0
            const priceMax = priceRangeMax ? Number.parseFloat(priceRangeMax) : Number.POSITIVE_INFINITY
            const priceAllowed = (property.price || 0) >= priceMin && (property.price || 0) <= priceMax

            const areaMin = areaRangeMin ? Number.parseFloat(areaRangeMin) : 0
            const areaMax = areaRangeMax ? Number.parseFloat(areaRangeMax) : Number.POSITIVE_INFINITY
            const areaAllowed = (property.totalArea || 0) >= areaMin && (property.totalArea || 0) <= areaMax

            return (
              searchAllowed &&
              statusAllowed &&
              bedroomAllowed &&
              floorAllowed &&
              viewAllowed &&
              typeAllowed &&
              phaseAllowed &&
              priceAllowed &&
              areaAllowed
            )
          } catch {
            return false
          }
        })
        .sort((a, b) => {
          try {
            if (priceSort === "asc") return (a.price || 0) - (b.price || 0)
            if (priceSort === "desc") return (b.price || 0) - (a.price || 0)
            return 0
          } catch {
            return 0
          }
        })
    } catch {
      return []
    }
  })()

  // Get unique values for filters
  const getUniqueValues = () => {
    try {
      const uniqueTypes = [...new Set(properties.map((p) => p.type).filter(Boolean))]
      const uniquePhases = [...new Set(properties.map((p) => p.phase).filter(Boolean))]
      const uniqueViews = [...new Set(properties.map((p) => p.view).filter(Boolean))]
      const uniqueBedrooms = [...new Set(properties.map((p) => (p.bedrooms || 0).toString()).filter(Boolean))].sort()

      return { uniqueTypes, uniquePhases, uniqueViews, uniqueBedrooms }
    } catch {
      return { uniqueTypes: [], uniquePhases: [], uniqueViews: [], uniqueBedrooms: [] }
    }
  }

  const { uniqueTypes, uniquePhases, uniqueViews, uniqueBedrooms } = getUniqueValues()

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Inventory Management</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading inventory...</p>
          </div>
        </div>
      </div>
    )
  }

  // Don't render until mounted
  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Inventory Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}>
            {viewMode === "table" ? "Card View" : "Table View"}
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProperties.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedProperties.length} properties selected (excluding sold properties)
            </span>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleBulkStatusUpdate}>
                Update Status
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedProperties([])}>
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by unit number, project name, tower, type, view, location, or phase..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={showAdvancedFilters ? "bg-blue-50 border-blue-200" : ""}
          >
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          {(globalSearch ||
            statusFilter !== "all" ||
            bedroomFilter !== "all" ||
            floorFilter ||
            viewFilter !== "all" ||
            typeFilter !== "all" ||
            phaseFilter !== "all" ||
            priceRangeMin ||
            priceRangeMax ||
            areaRangeMin ||
            areaRangeMax) && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="Developer Hold">Developer Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type-filter">Property Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bedroom-filter">Bedrooms</Label>
                <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bedrooms</SelectItem>
                    {uniqueBedrooms.map((bedroom) => (
                      <SelectItem key={bedroom} value={bedroom}>
                        {bedroom} {bedroom === "1" ? "Bedroom" : "Bedrooms"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phase-filter">Phase</Label>
                <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Phases</SelectItem>
                    {uniquePhases.map((phase) => (
                      <SelectItem key={phase} value={phase}>
                        {phase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="view-filter">View</Label>
                <Select value={viewFilter} onValueChange={setViewFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Views</SelectItem>
                    {uniqueViews.map((view) => (
                      <SelectItem key={view} value={view}>
                        {view}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="floor-filter">Floor</Label>
                <Input
                  id="floor-filter"
                  placeholder="Enter floor number"
                  value={floorFilter}
                  onChange={(e) => setFloorFilter(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="price-sort">Sort by Price</Label>
                <Select value={priceSort} onValueChange={(value: "none" | "asc" | "desc") => setPriceSort(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Sorting</SelectItem>
                    <SelectItem value="asc">Price: Low to High</SelectItem>
                    <SelectItem value="desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Price Range (AED)</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Min price"
                    type="number"
                    value={priceRangeMin}
                    onChange={(e) => setPriceRangeMin(e.target.value)}
                  />
                  <Input
                    placeholder="Max price"
                    type="number"
                    value={priceRangeMax}
                    onChange={(e) => setPriceRangeMax(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Area Range (sqft)</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Min area"
                    type="number"
                    value={areaRangeMin}
                    onChange={(e) => setAreaRangeMin(e.target.value)}
                  />
                  <Input
                    placeholder="Max area"
                    type="number"
                    value={areaRangeMax}
                    onChange={(e) => setAreaRangeMax(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredProperties.length} of {properties.length} properties
        </span>
        {selectedProperties.length > 0 && (
          <span className="font-medium text-blue-600">{selectedProperties.length} selected</span>
        )}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {["Available", "Reserved", "Sold", "Blocked", "Developer Hold"].map((status) => {
          const count = properties.filter((p) => p.status === status).length
          const filteredCount = filteredProperties.filter((p) => p.status === status).length
          const isActive = statusFilter === status

          return (
            <Card
              key={status}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isActive ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setStatusFilter(isActive ? "all" : status)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{status}</p>
                    <p className="text-2xl font-bold">{statusFilter === "all" ? count : filteredCount}</p>
                    {statusFilter !== "all" && filteredCount !== count && (
                      <p className="text-xs text-gray-500">of {count} total</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(status as Property["status"])} variant="secondary">
                    {Math.round((count / properties.length) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500">Try adjusting your search filters to find what you're looking for.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedProperties.length === filteredProperties.filter((p) => p.status !== "Sold").length &&
                        filteredProperties.filter((p) => p.status !== "Sold").length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProperties(filteredProperties.filter((p) => p.status !== "Sold").map((p) => p.id))
                        } else {
                          setSelectedProperties([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Unit Number</TableHead>
                  <TableHead>Property Info</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total Area</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>View</TableHead>
                  <TableHead>Area Details</TableHead>
                  <TableHead>Project Details</TableHead>
                  <TableHead>Price/sqft</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sale Details</TableHead>
                  <TableHead>Client Info</TableHead>
                  <TableHead>Price History</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id} className={getRowStyling(property.status)}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProperties.includes(property.id)}
                        onCheckedChange={(checked) => handleSelectProperty(property.id, checked as boolean)}
                        disabled={property.status === "Sold"}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {property.status === "Sold" && <Lock className="h-4 w-4 text-red-500" />}
                        {property.unitNumber || ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{property.type || ""}</div>
                        <div className="text-sm text-gray-500">
                          {property.bedrooms || 0} BR, {property.bathrooms || 0} BA
                        </div>
                        <div className="text-xs text-gray-400">{property.location || ""}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-green-600">{formatCurrency(property.price || 0)}</TableCell>
                    <TableCell>{formatArea(property.totalArea || 0)} sqft</TableCell>
                    <TableCell>{property.floor || 0}</TableCell>
                    <TableCell>{property.view || ""}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>Internal: {formatArea(property.internalArea || 0)}</div>
                        <div>External: {formatArea(property.externalArea || 0)}</div>
                        <div className="font-medium">Total: {formatArea(property.totalArea || 0)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{property.projectName || ""}</div>
                        <div className="text-sm text-gray-500">{property.towerName || ""}</div>
                        <div className="text-xs text-gray-400">{property.phase || ""}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(Math.round((property.price || 0) / (property.totalArea || 1)))}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(property.status)}>{property.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {property.status === "Reserved" && (
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{property.reservedBy || ""}</div>
                          <div className="text-gray-500">{property.reservedDate || ""}</div>
                          <div className="text-xs">{property.saleType || ""}</div>
                        </div>
                      )}
                      {property.status === "Sold" && (
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{property.soldBy || ""}</div>
                          <div className="text-gray-500">{property.soldDate || ""}</div>
                          {property.soldPrice && (
                            <div className="text-green-600 font-medium">{formatCurrency(property.soldPrice)}</div>
                          )}
                          <div className="text-xs">{property.saleType || ""}</div>
                          {property.externalAgencyName && (
                            <div className="text-xs text-blue-600">{property.externalAgencyName}</div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {(property.clientName || property.clientEmail || property.clientPhone) && (
                        <div className="space-y-1 text-sm">
                          {property.clientName && <div className="font-medium">{property.clientName}</div>}
                          {property.clientEmail && <div className="text-gray-500">{property.clientEmail}</div>}
                          {property.clientPhone && <div className="text-gray-500">{property.clientPhone}</div>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {property.priceHistory && property.priceHistory.length > 0 && (
                        <div className="text-sm">
                          <div className="font-medium">{property.priceHistory.length} changes</div>
                          <div className="text-gray-500">
                            Last: {new Date(property.priceHistory[0].changeDate).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" disabled={property.status === "Sold"}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview Offer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePaymentPlan(property)}>
                            <Calculator className="mr-2 h-4 w-4" />
                            Payment Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Upload Sales Offer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {canChangeStatus(property) && (
                            <>
                              <DropdownMenuItem onClick={() => handleMarkAsReserved(property)}>
                                Mark as Reserved
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMarkAsSold(property)}>
                                Mark as Sold
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {canEditProperty(property) && (
                            <DropdownMenuItem onClick={() => handleEdit(property)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {canEditProperty(property) && (
                            <DropdownMenuItem onClick={() => handleDelete(property.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                          {property.status === "Sold" && (
                            <DropdownMenuItem disabled className="text-gray-400">
                              <Lock className="mr-2 h-4 w-4" />
                              Property Sold (Read Only)
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      ) : (
        // Card view with similar styling
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500">Try adjusting your search filters to find what you're looking for.</p>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <Card key={property.id} className={`h-fit ${getRowStyling(property.status)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedProperties.includes(property.id)}
                        onCheckedChange={(checked) => handleSelectProperty(property.id, checked as boolean)}
                        disabled={property.status === "Sold"}
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                          {property.status === "Sold" && <Lock className="h-4 w-4 text-red-500" />}
                          <span>{property.unitNumber || ""}</span>
                        </CardTitle>
                        <p className="text-sm text-gray-600">{property.projectName || ""}</p>
                        <p className="text-xs text-gray-500">{property.towerName || ""}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{property.type || ""}</Badge>
                          <Badge className={getStatusColor(property.status)}>{property.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(property.price || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Area</p>
                      <p className="text-sm">{formatArea(property.totalArea || 0)} sqft</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Bedrooms</p>
                      <p className="text-sm font-medium">{property.bedrooms || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Floor</p>
                      <p className="text-sm font-medium">{property.floor || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">View</p>
                      <p className="text-sm font-medium">{property.view || ""}</p>
                    </div>
                  </div>

                  {/* Sale/Client Details for Sold/Reserved properties */}
                  {(property.status === "Sold" || property.status === "Reserved") && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="space-y-2 text-sm">
                        {property.status === "Sold" && property.soldBy && (
                          <div>
                            <span className="font-medium">Sold by:</span> {property.soldBy}
                          </div>
                        )}
                        {property.status === "Reserved" && property.reservedBy && (
                          <div>
                            <span className="font-medium">Reserved by:</span> {property.reservedBy}
                          </div>
                        )}
                        {property.clientName && (
                          <div>
                            <span className="font-medium">Client:</span> {property.clientName}
                          </div>
                        )}
                        {property.externalAgencyName && (
                          <div>
                            <span className="font-medium">Agency:</span> {property.externalAgencyName}
                          </div>
                        )}
                        {property.soldPrice && (
                          <div>
                            <span className="font-medium">Final Price:</span> {formatCurrency(property.soldPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Offer
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={property.status === "Sold"}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePaymentPlan(property)}>
                          <Calculator className="mr-2 h-4 w-4" />
                          Payment Plan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {canChangeStatus(property) && (
                          <>
                            <DropdownMenuItem onClick={() => handleMarkAsReserved(property)}>
                              Mark as Reserved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMarkAsSold(property)}>Mark as Sold</DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {canEditProperty(property) && (
                          <DropdownMenuItem onClick={() => handleEdit(property)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {canEditProperty(property) && (
                          <DropdownMenuItem onClick={() => handleDelete(property.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                        {property.status === "Sold" && (
                          <DropdownMenuItem disabled className="text-gray-400">
                            <Lock className="mr-2 h-4 w-4" />
                            Property Sold (Read Only)
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Edit Property Dialog */}
      {showEditDialog && editingProperty && (
        <PropertyEditDialog
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false)
            setEditingProperty(null)
          }}
          property={editingProperty}
          onSave={handleSaveEdit}
        />
      )}

      {/* Payment Plan Dialog */}
      {showPaymentPlanDialog && selectedPropertyForPayment && (
        <PaymentPlanGenerator
          isOpen={showPaymentPlanDialog}
          onClose={() => {
            setShowPaymentPlanDialog(false)
            setSelectedPropertyForPayment(null)
          }}
          propertyPrice={selectedPropertyForPayment.price}
          propertyName={selectedPropertyForPayment.unitNumber}
        />
      )}

      {/* Status Change Dialog */}
      {showStatusDialog && selectedPropertyForStatus && (
        <StatusChangeDialog
          isOpen={showStatusDialog}
          onClose={() => {
            setShowStatusDialog(false)
            setSelectedPropertyForStatus(null)
          }}
          onConfirm={handleStatusChange}
          status={statusDialogType}
          propertyName={selectedPropertyForStatus.unitNumber}
        />
      )}

      {/* Bulk Status Dialog */}
      {showBulkStatusDialog && (
        <BulkStatusDialog
          isOpen={showBulkStatusDialog}
          onClose={() => setShowBulkStatusDialog(false)}
          onConfirm={handleBulkStatusChange}
          selectedCount={selectedProperties.length}
        />
      )}
    </div>
  )
}
