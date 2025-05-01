"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Loader2 } from "lucide-react"

export interface ClientDetails {
  clientName: string
  clientEmail: string
  agencyName?: string
  agentName: string
}

interface ClientDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (details: ClientDetails) => void
  onCancel: () => void
  title?: string
  description?: string
  status: string
}

export function ClientDetailsDialog({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  title = "Client Details Required",
  description = "Please provide client and agent information for this property status change.",
  status,
}: ClientDetailsDialogProps) {
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    clientName: "",
    clientEmail: "",
    agencyName: "",
    agentName: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof ClientDetails, value: string) => {
    setClientDetails((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is modified
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!clientDetails.clientName.trim()) {
      newErrors.clientName = "Client name is required"
    }

    if (!clientDetails.clientEmail.trim()) {
      newErrors.clientEmail = "Client email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(clientDetails.clientEmail)) {
      newErrors.clientEmail = "Please enter a valid email address"
    }

    if (!clientDetails.agentName.trim()) {
      newErrors.agentName = "Agent name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Immediately submit the client details
      onSubmit(clientDetails)
      // Reset form after submission
      setClientDetails({
        clientName: "",
        clientEmail: "",
        agencyName: "",
        agentName: "",
      })
    } catch (error) {
      console.error("Error submitting client details:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description} Status will be changed to <span className="font-medium">{status}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="clientName" className="required">
              Client Name
            </Label>
            <Input
              id="clientName"
              value={clientDetails.clientName}
              onChange={(e) => handleChange("clientName", e.target.value)}
              placeholder="John Doe"
              className={errors.clientName ? "border-red-500" : ""}
            />
            {errors.clientName && <p className="text-sm text-red-500">{errors.clientName}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="clientEmail" className="required">
              Client Email
            </Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientDetails.clientEmail}
              onChange={(e) => handleChange("clientEmail", e.target.value)}
              placeholder="client@example.com"
              className={errors.clientEmail ? "border-red-500" : ""}
            />
            {errors.clientEmail && <p className="text-sm text-red-500">{errors.clientEmail}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="agencyName">Agency Name</Label>
            <Input
              id="agencyName"
              value={clientDetails.agencyName}
              onChange={(e) => handleChange("agencyName", e.target.value)}
              placeholder="Premier Real Estate (optional)"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="agentName" className="required">
              Agent Name
            </Label>
            <Input
              id="agentName"
              value={clientDetails.agentName}
              onChange={(e) => handleChange("agentName", e.target.value)}
              placeholder="Jane Smith"
              className={errors.agentName ? "border-red-500" : ""}
            />
            {errors.agentName && <p className="text-sm text-red-500">{errors.agentName}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Submit
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
