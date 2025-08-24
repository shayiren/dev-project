"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  projectName: string
  towerName: string
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
  salesOfferFile?: string
  salesOfferVersion?: string
  salesOfferValidUntil?: string
  salesOfferDescription?: string
}

interface BulkInventoryUploadProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (properties: Property[]) => void
}

export function BulkInventoryUpload({ isOpen, onClose, onUpload }: BulkInventoryUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadError(null)
    }
  }

  const downloadTemplate = () => {
    const template = `Unit Number,Project Name,Tower Name,Type,Location,Internal Area,External Area,Total Area,Price,Status,Phase,Bedrooms,Bathrooms,Floor,View,Internal Tag,External Tag,Reserved By,Reserved Date,Sold By,Sold Date,Sold Price,Sale Type,External Agency Name,Client Name,Client Email,Client Phone,Notes,Sales Offer File,Sales Offer Version,Sales Offer Valid Until,Sales Offer Description
V-A1-001,Luxury Villa A1,Tower A,Villa,Palm Jumeirah Dubai,5000,2000,7000,18365000,Available,Phase 1,5,6,1,Sea View,true,true,,,,,,,,,,,,,,,
A-B2-1502,Modern Apartment B2,Tower B,Apartment,Dubai Marina,1200,100,1300,1600000,Reserved,Phase 2,2,2,15,Marina View,true,false,Ahmed Al-Rashid,2024-01-15,,,christies,,John Smith,john.smith@email.com,+971 50 123 4567,Reserved for VIP client,,,
C-C3-0501,Commercial Space C3,Tower C,Commercial,Business Bay Dubai,3000,0,3000,5000000,Sold,Developer Holding,0,2,5,City View,false,true,,Sarah Johnson,2024-01-10,4800000,external_agency,Dubai Properties LLC,Ahmed Al-Mansouri,ahmed@company.ae,+971 50 987 6543,Sold to corporate client,sales-offer-c3.pdf,1.0,2024-12-31,Final sales offer for commercial unit`

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "inventory-template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const parseCSV = (csvText: string): Property[] => {
    const lines = csvText.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim())

    const properties: Property[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      if (values.length < 3) continue // At least unit number, project name, and type required

      const property: any = {}
      headers.forEach((header, index) => {
        const value = values[index] || ""
        switch (header) {
          case "Unit Number":
            property.unitNumber = value
            break
          case "Project Name":
            property.projectName = value
            break
          case "Tower Name":
            property.towerName = value
            break
          case "Type":
            property.type = value
            break
          case "Location":
            property.location = value
            break
          case "Internal Area":
            property.internalArea = Number.parseFloat(value) || 0
            break
          case "External Area":
            property.externalArea = Number.parseFloat(value) || 0
            break
          case "Total Area":
            property.totalArea = Number.parseFloat(value) || 0
            break
          case "Price":
            property.price = Number.parseFloat(value) || 0
            break
          case "Status":
            property.status = (value as Property["status"]) || "Available"
            break
          case "Phase":
            property.phase = value
            break
          case "Bedrooms":
            property.bedrooms = Number.parseInt(value) || 0
            break
          case "Bathrooms":
            property.bathrooms = Number.parseInt(value) || 0
            break
          case "Floor":
            property.floor = Number.parseInt(value) || 0
            break
          case "View":
            property.view = value
            break
          case "Internal Tag":
            property.internalTag = value.toLowerCase() === "true"
            break
          case "External Tag":
            property.externalTag = value.toLowerCase() === "true"
            break
          case "Reserved By":
            if (value) property.reservedBy = value
            break
          case "Reserved Date":
            if (value) property.reservedDate = value
            break
          case "Sold By":
            if (value) property.soldBy = value
            break
          case "Sold Date":
            if (value) property.soldDate = value
            break
          case "Sold Price":
            if (value) property.soldPrice = Number.parseFloat(value)
            break
          case "Sale Type":
            if (value) property.saleType = value as "christies" | "external_agency"
            break
          case "External Agency Name":
            if (value) property.externalAgencyName = value
            break
          case "Client Name":
            if (value) property.clientName = value
            break
          case "Client Email":
            if (value) property.clientEmail = value
            break
          case "Client Phone":
            if (value) property.clientPhone = value
            break
          case "Notes":
            if (value) property.notes = value
            break
          case "Sales Offer File":
            if (value) property.salesOfferFile = value
            break
          case "Sales Offer Version":
            if (value) property.salesOfferVersion = value
            break
          case "Sales Offer Valid Until":
            if (value) property.salesOfferValidUntil = value
            break
          case "Sales Offer Description":
            if (value) property.salesOfferDescription = value
            break
        }
      })

      // Only require unit number, project name, and type as mandatory
      if (property.unitNumber && property.projectName && property.type) {
        // Set defaults for missing required fields
        if (!property.towerName) property.towerName = ""
        if (!property.location) property.location = ""
        if (!property.phase) property.phase = "Phase 1"
        if (!property.view) property.view = "Standard View"
        if (property.internalTag === undefined) property.internalTag = true
        if (property.externalTag === undefined) property.externalTag = true

        properties.push(property as Property)
      }
    }

    return properties
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const text = await file.text()
      const properties = parseCSV(text)

      if (properties.length === 0) {
        throw new Error("No valid properties found in the file. Please check the format.")
      }

      onUpload(properties)
      onClose()
      setFile(null)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to process file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setFile(null)
    setUploadError(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Inventory Upload</DialogTitle>
          <DialogDescription>Upload a CSV file to add multiple properties to your inventory.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="file">CSV File</Label>
            <Input id="file" type="file" accept=".csv" onChange={handleFileChange} />
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• First row must contain column headers</li>
              <li>
                • <strong>Required columns:</strong> Unit Number, Project Name, Type
              </li>
              <li>
                • <strong>Optional columns:</strong> All other fields can be left empty
              </li>
              <li>• Status must be one of: Available, Reserved, Sold, Blocked, Developer Hold</li>
              <li>• Sale Type must be: christies or external_agency (if provided)</li>
              <li>• Boolean fields (Internal Tag, External Tag) should be "true" or "false"</li>
              <li>• Numeric fields should contain valid numbers</li>
              <li>• Date fields should be in YYYY-MM-DD format</li>
            </ul>
          </div>

          <Button variant="outline" onClick={downloadTemplate} className="w-full bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Download CSV Template
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Properties"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
