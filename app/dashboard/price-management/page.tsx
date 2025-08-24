"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  DollarSign,
  Percent,
  Home,
  Building,
  Eye,
} from "lucide-react"
import { PriceAdjustmentPreview } from "@/components/price-adjustment-preview"

// Import the Property interface and mock data
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
    oldPricePerSqft: number
    newPricePerSqft: number
    changeDate: string
    changedBy: string
    changeReason: string
    changeType: "manual_price" | "price_per_sqft" | "bulk_adjustment"
  }>
  hasMaidRoom?: boolean
  hasStudyRoom?: boolean
}

// Mock data with additional properties
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
    hasMaidRoom: true,
    hasStudyRoom: true,
  },
  {
    id: 2,
    unitNumber: "A-B2-1505",
    projectName: "Modern Apartment B2",
    towerName: "Tower B",
    type: "Apartment",
    location: "Dubai Marina",
    internalArea: 1200,
    externalArea: 100,
    totalArea: 1300,
    price: 1600000,
    status: "Available",
    phase: "Phase 2",
    bedrooms: 2,
    bathrooms: 2,
    floor: 15,
    view: "Marina View",
    internalTag: true,
    externalTag: false,
    hasStudyRoom: true,
  },
  {
    id: 3,
    unitNumber: "C-C3-0505",
    projectName: "Commercial Space C3",
    towerName: "Tower C",
    type: "Commercial",
    location: "Business Bay, Dubai",
    internalArea: 3000,
    externalArea: 0,
    totalArea: 3000,
    price: 5000000,
    status: "Available",
    phase: "Developer Holding",
    bedrooms: 0,
    bathrooms: 2,
    floor: 5,
    view: "City View",
    internalTag: false,
    externalTag: true,
  },
  {
    id: 4,
    unitNumber: "P-D4-2205",
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
    hasMaidRoom: true,
    hasStudyRoom: true,
  },
  {
    id: 5,
    unitNumber: "S-E5-0105",
    projectName: "Studio E5",
    towerName: "Tower E",
    type: "Studio",
    location: "Jumeirah Village Circle",
    internalArea: 500,
    externalArea: 50,
    totalArea: 550,
    price: 650000,
    status: "Available",
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
    unitNumber: "A-F6-1805",
    projectName: "Apartment F6",
    towerName: "Tower F",
    type: "Apartment",
    location: "Dubai Marina",
    internalArea: 1400,
    externalArea: 150,
    totalArea: 1550,
    price: 1850000,
    status: "Available",
    phase: "Phase 2",
    bedrooms: 3,
    bathrooms: 3,
    floor: 18,
    view: "Sea View",
    internalTag: true,
    externalTag: true,
    hasMaidRoom: true,
  },
  {
    id: 7,
    unitNumber: "A-G7-2005",
    projectName: "Apartment G7",
    towerName: "Tower G",
    type: "Apartment",
    location: "Dubai Marina",
    internalArea: 1100,
    externalArea: 80,
    totalArea: 1180,
    price: 1450000,
    status: "Available",
    phase: "Phase 2",
    bedrooms: 2,
    bathrooms: 2,
    floor: 20,
    view: "Marina View",
    internalTag: true,
    externalTag: true,
    hasStudyRoom: true,
  },
]

export default function PriceManagementPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperties, setSelectedProperties] = useState<number[]>([])
  const [adjustmentType, setAdjustmentType] = useState<"percentage" | "fixed_amount" | "price_per_sqft">("percentage")
  const [adjustmentValue, setAdjustmentValue] = useState("")
  const [filterCriteria, setFilterCriteria] = useState({
    bedroom: "all",
    view: "all",
    floor: "",
    series: "",
    hasMaidRoom: false,
    hasStudyRoom: false,
    status: "Available",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])

  useEffect(() => {
    setProperties(mockProperties)
  }, [])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const formatArea = (area: number): string => {
    return new Intl.NumberFormat("en-AE", { maximumFractionDigits: 2 }).format(area || 0)
  }

  // Filter properties based on criteria
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      searchTerm === "" ||
      property.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.towerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBedroom = filterCriteria.bedroom === "all" || property.bedrooms.toString() === filterCriteria.bedroom

    const matchesView =
      filterCriteria.view === "all" || property.view.toLowerCase().includes(filterCriteria.view.toLowerCase())

    const matchesFloor = filterCriteria.floor === "" || property.floor.toString().includes(filterCriteria.floor)

    const matchesSeries = filterCriteria.series === "" || property.unitNumber.endsWith(filterCriteria.series)

    const matchesMaidRoom = !filterCriteria.hasMaidRoom || property.hasMaidRoom

    const matchesStudyRoom = !filterCriteria.hasStudyRoom || property.hasStudyRoom

    const matchesStatus = filterCriteria.status === "all" || property.status === filterCriteria.status

    return (
      matchesSearch &&
      matchesBedroom &&
      matchesView &&
      matchesFloor &&
      matchesSeries &&
      matchesMaidRoom &&
      matchesStudyRoom &&
      matchesStatus
    )
  })

  // Calculate new prices based on adjustment
  const calculateNewPrice = (currentPrice: number, totalArea: number) => {
    const adjustment = Number.parseFloat(adjustmentValue) || 0

    switch (adjustmentType) {
      case "percentage":
        return currentPrice * (1 + adjustment / 100)
      case "fixed_amount":
        return Math.max(0, currentPrice + adjustment) // Ensure price doesn't go negative
      case "price_per_sqft":
        return Math.max(0, adjustment * totalArea) // Ensure price doesn't go negative
      default:
        return currentPrice
    }
  }

  // Handle property selection
  const handleSelectProperty = (propertyId: number, checked: boolean) => {
    if (checked) {
      setSelectedProperties((prev) => [...prev, propertyId])
    } else {
      setSelectedProperties((prev) => prev.filter((id) => id !== propertyId))
    }
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProperties(filteredProperties.map((p) => p.id))
    } else {
      setSelectedProperties([])
    }
  }

  // Generate preview data
  const generatePreview = () => {
    if (selectedProperties.length === 0) {
      alert("Please select at least one property")
      return
    }

    if (!adjustmentValue || adjustmentValue === "0") {
      alert("Please enter a valid adjustment value")
      return
    }

    const adjustment = Number.parseFloat(adjustmentValue)
    if (isNaN(adjustment)) {
      alert("Please enter a valid number for adjustment")
      return
    }

    const preview = properties
      .filter((p) => selectedProperties.includes(p.id))
      .map((property) => {
        const newPrice = calculateNewPrice(property.price, property.totalArea)
        const oldPricePerSqft = property.price / property.totalArea
        const newPricePerSqft = newPrice / property.totalArea
        const priceChange = newPrice - property.price
        const percentageChange = (priceChange / property.price) * 100

        return {
          id: property.id,
          unitNumber: property.unitNumber,
          projectName: property.projectName,
          towerName: property.towerName,
          type: property.type,
          bedrooms: property.bedrooms,
          totalArea: property.totalArea,
          oldPrice: property.price,
          newPrice: Math.round(newPrice),
          oldPricePerSqft: Math.round(oldPricePerSqft),
          newPricePerSqft: Math.round(newPricePerSqft),
          priceChange: Math.round(priceChange),
          percentageChange: Number.parseFloat(percentageChange.toFixed(2)),
        }
      })

    console.log("Preview data generated:", preview) // Debug log
    setPreviewData(preview)
    setShowPreview(true)
  }

  // Apply price changes
  const applyPriceChanges = () => {
    const updatedProperties = properties.map((property) => {
      const previewItem = previewData.find((p) => p.id === property.id)
      if (previewItem) {
        const priceHistoryEntry = {
          id: Date.now().toString() + property.id,
          propertyId: property.id,
          oldPrice: property.price,
          newPrice: previewItem.newPrice,
          oldPricePerSqft: property.price / property.totalArea,
          newPricePerSqft: previewItem.newPrice / property.totalArea,
          changeDate: new Date().toISOString(),
          changedBy: "Admin User",
          changeReason: `Bulk adjustment: ${adjustmentType} ${adjustmentValue}${adjustmentType === "percentage" ? "%" : ""}`,
          changeType: "bulk_adjustment" as const,
        }

        return {
          ...property,
          price: previewItem.newPrice,
          priceHistory: [priceHistoryEntry, ...(property.priceHistory || [])],
        }
      }
      return property
    })

    setProperties(updatedProperties)
    setShowPreview(false)
    setSelectedProperties([])
    setAdjustmentValue("")
    alert(`Successfully updated prices for ${previewData.length} properties`)
  }

  // Get unique values for filters
  const uniqueBedrooms = [...new Set(properties.map((p) => p.bedrooms.toString()))].sort()
  const uniqueViews = [...new Set(properties.map((p) => p.view))].sort()

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Price Management</h2>
          <p className="text-gray-600">Bulk price adjustments for property inventory</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50">
            <Calculator className="mr-1 h-3 w-3" />
            {filteredProperties.length} Properties
          </Badge>
          {selectedProperties.length > 0 && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              {selectedProperties.length} Selected
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Filtered</p>
                <p className="text-2xl font-bold">{filteredProperties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Checkbox className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium text-gray-600">Selected</p>
                <p className="text-2xl font-bold">{selectedProperties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-lg font-bold">
                  {formatCurrency(
                    selectedProperties.length > 0
                      ? properties
                          .filter((p) => selectedProperties.includes(p.id))
                          .reduce((sum, p) => sum + p.price, 0) / selectedProperties.length
                      : properties.reduce((sum, p) => sum + p.price, 0) / properties.length,
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Properties</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div>
            <Label htmlFor="search">Search Properties</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="Search by unit number, project name, or tower..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="bedroom-filter">Bedrooms</Label>
              <Select
                value={filterCriteria.bedroom}
                onValueChange={(value) => setFilterCriteria({ ...filterCriteria, bedroom: value })}
              >
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
              <Label htmlFor="view-filter">View</Label>
              <Select
                value={filterCriteria.view}
                onValueChange={(value) => setFilterCriteria({ ...filterCriteria, view: value })}
              >
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
                value={filterCriteria.floor}
                onChange={(e) => setFilterCriteria({ ...filterCriteria, floor: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="series-filter">Unit Series (Ending)</Label>
              <Input
                id="series-filter"
                placeholder="e.g., 05, 10, 15"
                value={filterCriteria.series}
                onChange={(e) => setFilterCriteria({ ...filterCriteria, series: e.target.value })}
              />
            </div>
          </div>

          {/* Special Features */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="maid-room"
                checked={filterCriteria.hasMaidRoom}
                onCheckedChange={(checked) => setFilterCriteria({ ...filterCriteria, hasMaidRoom: checked as boolean })}
              />
              <Label htmlFor="maid-room">Has Maid Room</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="study-room"
                checked={filterCriteria.hasStudyRoom}
                onCheckedChange={(checked) =>
                  setFilterCriteria({ ...filterCriteria, hasStudyRoom: checked as boolean })
                }
              />
              <Label htmlFor="study-room">Has Study Room</Label>
            </div>
          </div>

          {/* Status Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status-filter">Property Status</Label>
              <Select
                value={filterCriteria.status}
                onValueChange={(value) => setFilterCriteria({ ...filterCriteria, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Available">Available Only</SelectItem>
                  <SelectItem value="Reserved">Reserved Only</SelectItem>
                  <SelectItem value="Sold">Sold Only</SelectItem>
                  <SelectItem value="Blocked">Blocked Only</SelectItem>
                  <SelectItem value="Developer Hold">Developer Hold Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Adjustment Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Price Adjustment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="adjustment-type">Adjustment Type</Label>
              <Select
                value={adjustmentType}
                onValueChange={(value: "percentage" | "fixed_amount" | "price_per_sqft") => setAdjustmentType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4" />
                      <span>Percentage Increase/Decrease</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="fixed_amount">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Fixed Amount</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="price_per_sqft">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>Set Price per Sqft</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="adjustment-value">
                {adjustmentType === "percentage" && "Percentage (%)"}
                {adjustmentType === "fixed_amount" && "Amount (AED)"}
                {adjustmentType === "price_per_sqft" && "Price per Sqft (AED)"}
              </Label>
              <Input
                id="adjustment-value"
                type="number"
                step={adjustmentType === "percentage" ? "0.1" : "1"}
                placeholder={
                  adjustmentType === "percentage"
                    ? "e.g., 10 for 10% increase, -5 for 5% decrease"
                    : adjustmentType === "fixed_amount"
                      ? "e.g., 50000 for AED 50,000 increase"
                      : "e.g., 1200 for AED 1,200 per sqft"
                }
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(e.target.value)}
              />
            </div>
          </div>

          {/* Adjustment Info */}
          {adjustmentValue && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {adjustmentType === "percentage" && (
                  <>
                    This will {Number.parseFloat(adjustmentValue) >= 0 ? "increase" : "decrease"} prices by{" "}
                    <strong>{Math.abs(Number.parseFloat(adjustmentValue))}%</strong> for selected properties.
                  </>
                )}
                {adjustmentType === "fixed_amount" && (
                  <>
                    This will {Number.parseFloat(adjustmentValue) >= 0 ? "add" : "subtract"}{" "}
                    <strong>{formatCurrency(Math.abs(Number.parseFloat(adjustmentValue)))}</strong> to/from selected
                    properties.
                  </>
                )}
                {adjustmentType === "price_per_sqft" && (
                  <>
                    This will set the price to <strong>{formatCurrency(Number.parseFloat(adjustmentValue))}</strong> per
                    sqft for selected properties.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={generatePreview}
              disabled={selectedProperties.length === 0 || !adjustmentValue || adjustmentValue === "0"}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Changes ({selectedProperties.length} selected)</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedProperties([])
                setAdjustmentValue("")
              }}
            >
              Clear Selection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Properties ({filteredProperties.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label>Select All</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead>Unit Number</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Bedrooms</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>View</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Price/Sqft</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProperties.includes(property.id)}
                        onCheckedChange={(checked) => handleSelectProperty(property.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{property.unitNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{property.projectName}</div>
                        <div className="text-sm text-gray-500">{property.towerName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell>{property.bedrooms}</TableCell>
                    <TableCell>{property.floor}</TableCell>
                    <TableCell>{property.view}</TableCell>
                    <TableCell>{formatArea(property.totalArea)} sqft</TableCell>
                    <TableCell className="font-bold text-green-600">{formatCurrency(property.price)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(Math.round(property.price / property.totalArea))}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {property.hasMaidRoom && (
                          <Badge variant="outline" className="text-xs">
                            Maid Room
                          </Badge>
                        )}
                        {property.hasStudyRoom && (
                          <Badge variant="outline" className="text-xs">
                            Study Room
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={property.status === "Available" ? "default" : "secondary"}
                        className={
                          property.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : property.status === "Reserved"
                              ? "bg-blue-100 text-blue-800"
                              : property.status === "Sold"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }
                      >
                        {property.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Price Adjustment Preview Dialog */}
      {showPreview && (
        <PriceAdjustmentPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onConfirm={applyPriceChanges}
          previewData={previewData}
          adjustmentType={adjustmentType}
          adjustmentValue={adjustmentValue}
        />
      )}
    </div>
  )
}
