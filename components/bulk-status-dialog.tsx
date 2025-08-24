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

interface BulkStatusDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (status: "Available" | "Reserved" | "Sold" | "Blocked" | "Developer Hold", data?: any) => void
  selectedCount: number
}

export function BulkStatusDialog({ isOpen, onClose, onConfirm, selectedCount }: BulkStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<
    "Available" | "Reserved" | "Sold" | "Blocked" | "Developer Hold"
  >("Available")
  const [formData, setFormData] = useState({
    agentName: "",
    date: new Date().toISOString().split("T")[0],
    finalPrice: "",
    saleType: "christies" as "christies" | "external_agency",
    externalAgencyName: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedStatus === "Reserved" || selectedStatus === "Sold") {
      onConfirm(selectedStatus, formData)
    } else {
      onConfirm(selectedStatus)
    }

    onClose()
    // Reset form
    setSelectedStatus("Available")
    setFormData({
      agentName: "",
      date: new Date().toISOString().split("T")[0],
      finalPrice: "",
      saleType: "christies",
      externalAgencyName: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: "",
    })
  }

  const handleClose = () => {
    onClose()
    // Reset form
    setSelectedStatus("Available")
    setFormData({
      agentName: "",
      date: new Date().toISOString().split("T")[0],
      finalPrice: "",
      saleType: "christies",
      externalAgencyName: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: "",
    })
  }

  const requiresDetails = selectedStatus === "Reserved" || selectedStatus === "Sold"

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Status Update</DialogTitle>
          <DialogDescription>Update the status of {selectedCount} selected properties.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="status">New Status *</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value: "Available" | "Reserved" | "Sold" | "Blocked" | "Developer Hold") =>
                setSelectedStatus(value)
              }
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

          {requiresDetails && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agentName">Agent Name *</Label>
                  <Input
                    id="agentName"
                    value={formData.agentName}
                    onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">{selectedStatus === "Reserved" ? "Reservation" : "Sale"} Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              {selectedStatus === "Sold" && (
                <div>
                  <Label htmlFor="finalPrice">Final Sale Price (AED)</Label>
                  <Input
                    id="finalPrice"
                    type="number"
                    placeholder="Enter final sale price (will apply to all selected properties)"
                    value={formData.finalPrice}
                    onChange={(e) => setFormData({ ...formData, finalPrice: e.target.value })}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="saleType">Sale Type *</Label>
                <Select
                  value={formData.saleType}
                  onValueChange={(value: "christies" | "external_agency") =>
                    setFormData({ ...formData, saleType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="christies">Christie's</SelectItem>
                    <SelectItem value="external_agency">External Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.saleType === "external_agency" && (
                <div>
                  <Label htmlFor="externalAgencyName">External Agency Name *</Label>
                  <Input
                    id="externalAgencyName"
                    value={formData.externalAgencyName}
                    onChange={(e) => setFormData({ ...formData, externalAgencyName: e.target.value })}
                    required={formData.saleType === "external_agency"}
                    placeholder="Enter external agency name"
                  />
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-medium">Client Information (Optional for bulk updates)</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="Enter client name (optional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Client Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      placeholder="Enter client email (optional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">Client Phone</Label>
                    <Input
                      id="clientPhone"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      placeholder="Enter client phone (optional)"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this bulk update (optional)..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Update {selectedCount} Properties</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
