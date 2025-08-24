"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"

interface Property {
  id: number
  name: string
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
  unitNumber: string
  view: string
  internalTag: boolean
  externalTag: boolean
  priceHistory?: any[]
  salesOfferFile?: string
  salesOfferUploadDate?: string
  salesOfferVersion?: string
  salesOfferValidUntil?: string
  salesOfferDescription?: string
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

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  properties: Property[]
}

export function ExportDialog({ isOpen, onClose, properties }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<"csv" | "excel">("csv")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [includeFields, setIncludeFields] = useState({
    basic: true,
    pricing: true,
    location: true,
    status: true,
    client: false,
    salesOffer: false,
    priceHistory: false,
  })

  const handleExport = () => {
    // Filter properties based on status
    const filteredProperties = properties.filter(
      (property) => statusFilter === "all" || property.status === statusFilter,
    )

    // Create headers based on selected fields
    const headers = []
    if (includeFields.basic) {
      headers.push("Unit Number", "Name", "Type", "Bedrooms", "Bathrooms", "Floor", "View", "Phase")
    }
    if (includeFields.pricing) {
      headers.push("Price", "Internal Area", "External Area", "Total Area", "Price per sqft")
    }
    if (includeFields.location) {
      headers.push("Location")
    }
    if (includeFields.status) {
      headers.push("Status", "Reserved By", "Reserved Date", "Sold By", "Sold Date", "Final Price", "Sale Type")
    }
    if (includeFields.client) {
      headers.push("Client Name", "Client Email", "Client Phone")
    }
    if (includeFields.salesOffer) {
      headers.push("Sales Offer File", "Sales Offer Version", "Sales Offer Valid Until")
    }
    if (includeFields.priceHistory) {
      headers.push("Price Changes Count", "Last Price Change Date")
    }

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...filteredProperties.map((property) => {
        const row = []
        if (includeFields.basic) {
          row.push(
            property.unitNumber,
            property.name,
            property.type,
            property.bedrooms,
            property.bathrooms,
            property.floor,
            property.view,
            property.phase,
          )
        }
        if (includeFields.pricing) {
          row.push(
            property.price,
            property.internalArea,
            property.externalArea,
            property.totalArea,
            Math.round(property.price / property.totalArea),
          )
        }
        if (includeFields.location) {
          row.push(property.location)
        }
        if (includeFields.status) {
          row.push(
            property.status,
            property.reservedBy || "",
            property.reservedDate || "",
            property.soldBy || "",
            property.soldDate || "",
            property.soldPrice || "",
            property.saleType || "",
          )
        }
        if (includeFields.client) {
          row.push(property.clientName || "", property.clientEmail || "", property.clientPhone || "")
        }
        if (includeFields.salesOffer) {
          row.push(property.salesOfferFile || "", property.salesOfferVersion || "", property.salesOfferValidUntil || "")
        }
        if (includeFields.priceHistory) {
          row.push(
            property.priceHistory?.length || 0,
            property.priceHistory?.[0]?.changeDate
              ? new Date(property.priceHistory[0].changeDate).toLocaleDateString()
              : "",
          )
        }
        return row.join(",")
      }),
    ].join("\n")

    // Download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `inventory-export-${new Date().toISOString().split("T")[0]}.${exportFormat}`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Inventory Data</DialogTitle>
          <DialogDescription>Choose the format and data to include in your export.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="format">Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: "csv" | "excel") => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel (XLSX)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="statusFilter">Filter by Status</Label>
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
            <Label>Include Fields</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="basic"
                  checked={includeFields.basic}
                  onCheckedChange={(checked) => setIncludeFields({ ...includeFields, basic: checked as boolean })}
                />
                <Label htmlFor="basic">Basic Info (Unit, Name, Type, Bedrooms, etc.)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pricing"
                  checked={includeFields.pricing}
                  onCheckedChange={(checked) => setIncludeFields({ ...includeFields, pricing: checked as boolean })}
                />
                <Label htmlFor="pricing">Pricing & Area Details</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="location"
                  checked={includeFields.location}
                  onCheckedChange={(checked) => setIncludeFields({ ...includeFields, location: checked as boolean })}
                />
                <Label htmlFor="location">Location Information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status"
                  checked={includeFields.status}
                  onCheckedChange={(checked) => setIncludeFields({ ...includeFields, status: checked as boolean })}
                />
                <Label htmlFor="status">Status & Sale Details</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="client"
                  checked={includeFields.client}
                  onCheckedChange={(checked) => setIncludeFields({ ...includeFields, client: checked as boolean })}
                />
                <Label htmlFor="client">Client Information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="salesOffer"
                  checked={includeFields.salesOffer}
                  onCheckedChange={(checked) => setIncludeFields({ ...includeFields, salesOffer: checked as boolean })}
                />
                <Label htmlFor="salesOffer">Sales Offer Details</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priceHistory"
                  checked={includeFields.priceHistory}
                  onCheckedChange={(checked) =>
                    setIncludeFields({ ...includeFields, priceHistory: checked as boolean })
                  }
                />
                <Label htmlFor="priceHistory">Price History Summary</Label>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {properties.filter((p) => statusFilter === "all" || p.status === statusFilter).length} properties will be
            exported
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export {exportFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
