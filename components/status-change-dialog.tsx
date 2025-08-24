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

interface StatusChangeDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: any) => void
  status: "Reserved" | "Sold"
  propertyName: string
}

export function StatusChangeDialog({ isOpen, onClose, onConfirm, status, propertyName }: StatusChangeDialogProps) {
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
    onConfirm(formData)
    onClose()
    // Reset form
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Mark Property as {status} - {propertyName}
          </DialogTitle>
          <DialogDescription>Please provide the details for this {status.toLowerCase()} transaction.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="date">{status === "Reserved" ? "Reservation" : "Sale"} Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          {status === "Sold" && (
            <div>
              <Label htmlFor="finalPrice">Final Sale Price (AED)</Label>
              <Input
                id="finalPrice"
                type="number"
                placeholder="Enter final sale price"
                value={formData.finalPrice}
                onChange={(e) => setFormData({ ...formData, finalPrice: e.target.value })}
              />
            </div>
          )}

          <div>
            <Label htmlFor="saleType">Sale Type *</Label>
            <Select
              value={formData.saleType}
              onValueChange={(value: "christies" | "external_agency") => setFormData({ ...formData, saleType: value })}
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
            <h4 className="font-medium">Client Information (Optional)</h4>
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
              placeholder="Additional notes about this transaction (optional)..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Confirm {status}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
