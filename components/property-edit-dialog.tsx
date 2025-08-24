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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

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

interface PropertyEditDialogProps {
  isOpen: boolean
  onClose: () => void
  property: Property
  onSave: (property: Property) => void
}

export function PropertyEditDialog({ isOpen, onClose, property, onSave }: PropertyEditDialogProps) {
  const [formData, setFormData] = useState<Property>({ ...property })
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "pricing">("basic")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update total area when internal or external area changes
    const updatedFormData = {
      ...formData,
      totalArea: (formData.internalArea || 0) + (formData.externalArea || 0),
    }

    // Add price history if price changed
    if (updatedFormData.price !== property.price) {
      const priceHistoryEntry = {
        id: Date.now().toString(),
        propertyId: property.id,
        oldPrice: property.price,
        newPrice: updatedFormData.price,
        changeDate: new Date().toISOString(),
        changedBy: "Current User",
        changeReason: "Manual price update",
      }

      updatedFormData.priceHistory = [priceHistoryEntry, ...(property.priceHistory || [])]
    }

    onSave(updatedFormData)
  }

  const handleClose = () => {
    setFormData({ ...property })
    setActiveTab("basic")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property - {property.unitNumber}</DialogTitle>
          <DialogDescription>Update property information and details.</DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "basic" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Basic Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "details" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "pricing" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Pricing & Area
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unitNumber">Unit Number *</Label>
                  <Input
                    id="unitNumber"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Property Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="towerName">Tower Name</Label>
                  <Input
                    id="towerName"
                    value={formData.towerName}
                    onChange={(e) => setFormData({ ...formData, towerName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phase">Phase</Label>
                  <Input
                    id="phase"
                    value={formData.phase}
                    onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Property["status"]) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Reserved">Reserved</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                      <SelectItem value="Developer Hold">Developer Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    type="number"
                    min="0"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="view">View</Label>
                <Input
                  id="view"
                  value={formData.view}
                  onChange={(e) => setFormData({ ...formData, view: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internalTag"
                    checked={formData.internalTag}
                    onCheckedChange={(checked) => setFormData({ ...formData, internalTag: checked as boolean })}
                  />
                  <Label htmlFor="internalTag">Internal Tag</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="externalTag"
                    checked={formData.externalTag}
                    onCheckedChange={(checked) => setFormData({ ...formData, externalTag: checked as boolean })}
                  />
                  <Label htmlFor="externalTag">External Tag</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about this property..."
                />
              </div>
            </div>
          )}

          {/* Pricing & Area Tab */}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Total Price (AED) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                    required
                  />
                  {formData.price !== property.price && (
                    <p className="text-sm text-orange-600 mt-1">Price change will be recorded in price history</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="pricePerSqft">Price per sqft (AED)</Label>
                  <Input
                    id="pricePerSqft"
                    type="number"
                    min="0"
                    value={formData.totalArea > 0 ? Math.round(formData.price / formData.totalArea) : 0}
                    onChange={(e) => {
                      const pricePerSqft = Number.parseFloat(e.target.value) || 0
                      const newTotalPrice = pricePerSqft * (formData.totalArea || 0)
                      setFormData({ ...formData, price: newTotalPrice })
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Changes total price automatically</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="internalArea">Internal Area (sqft) *</Label>
                  <Input
                    id="internalArea"
                    type="number"
                    min="0"
                    value={formData.internalArea}
                    onChange={(e) => {
                      const internalArea = Number.parseFloat(e.target.value) || 0
                      const newTotalArea = internalArea + (formData.externalArea || 0)
                      const currentPricePerSqft = formData.totalArea > 0 ? formData.price / formData.totalArea : 0
                      const newPrice = newTotalArea > 0 ? currentPricePerSqft * newTotalArea : formData.price

                      setFormData({
                        ...formData,
                        internalArea,
                        totalArea: newTotalArea,
                        price: newPrice,
                      })
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="externalArea">External Area (sqft)</Label>
                  <Input
                    id="externalArea"
                    type="number"
                    min="0"
                    value={formData.externalArea}
                    onChange={(e) => {
                      const externalArea = Number.parseFloat(e.target.value) || 0
                      const newTotalArea = (formData.internalArea || 0) + externalArea
                      const currentPricePerSqft = formData.totalArea > 0 ? formData.price / formData.totalArea : 0
                      const newPrice = newTotalArea > 0 ? currentPricePerSqft * newTotalArea : formData.price

                      setFormData({
                        ...formData,
                        externalArea,
                        totalArea: newTotalArea,
                        price: newPrice,
                      })
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="totalArea">Total Area (sqft)</Label>
                  <Input id="totalArea" type="number" value={formData.totalArea} disabled className="bg-gray-50" />
                  <p className="text-xs text-gray-500 mt-1">Auto-calculated</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Price Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Price per sqft:</span>
                    <span className="font-medium ml-2">
                      AED{" "}
                      {formData.totalArea > 0 ? Math.round(formData.price / formData.totalArea).toLocaleString() : 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Value:</span>
                    <span className="font-medium ml-2">AED {formData.price.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Area:</span>
                    <span className="font-medium ml-2">{formData.totalArea.toLocaleString()} sqft</span>
                  </div>
                </div>

                {formData.price !== property.price && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <p className="text-sm text-orange-800">
                      <strong>Price Change:</strong> {formData.price > property.price ? "↗" : "↘"}
                      AED {Math.abs(formData.price - property.price).toLocaleString()}(
                      {formData.price > property.price ? "+" : "-"}
                      {(Math.abs((formData.price - property.price) / property.price) * 100).toFixed(1)}%)
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-900">💡 Pricing Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Edit <strong>Total Price</strong> to set a specific property value
                  </li>
                  <li>
                    • Edit <strong>Price per sqft</strong> to automatically calculate total price based on area
                  </li>
                  <li>• Changing area will maintain the current price per sqft ratio</li>
                  <li>• All price changes are tracked in the property's price history</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
