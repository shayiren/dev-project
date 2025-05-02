"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ReservationDeedFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: any | null
}

export function ReservationDeedForm({ open, onOpenChange, property }: ReservationDeedFormProps) {
  const [clientName, setClientName] = useState("")
  const [reservationDate, setReservationDate] = useState("")

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Submitting reservation deed with:", {
      clientName,
      reservationDate,
      property,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reservation Deed</DialogTitle>
          <DialogDescription>Fill in the details to generate a reservation deed.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientName" className="text-right">
              Client Name
            </Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reservationDate" className="text-right">
              Reservation Date
            </Label>
            <Input
              id="reservationDate"
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Generate Deed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
