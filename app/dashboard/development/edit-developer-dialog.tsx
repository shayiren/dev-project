"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EditDeveloperDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeveloperUpdated: () => void
  developer: any | null
}

export function EditDeveloperDialog({ open, onOpenChange, onDeveloperUpdated, developer }: EditDeveloperDialogProps) {
  const [name, setName] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [website, setWebsite] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load developer data when the dialog opens
  useEffect(() => {
    if (developer) {
      setName(developer.name || "")
      setContactPerson(developer.contactPerson || "")
      setEmail(developer.email || "")
      setPhone(developer.phone || "")
      setAddress(developer.address || "")
      setWebsite(developer.website || "")
      setDescription(developer.description || "")
    }
  }, [developer])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Developer name is required"
    if (!contactPerson.trim()) newErrors.contactPerson = "Contact person is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm() || !developer) return

    const updatedDeveloper = {
      ...developer,
      name,
      contactPerson,
      email,
      phone,
      address,
      website,
      description,
    }

    // Get existing developers from localStorage
    const savedDevelopers = localStorage.getItem("realEstateDeveloperDetails")
    const developers = savedDevelopers ? JSON.parse(savedDevelopers) : []

    // Update the developer
    const updatedDevelopers = developers.map((dev: any) => (dev.id === developer.id ? updatedDeveloper : dev))

    // Save back to localStorage
    localStorage.setItem("realEstateDeveloperDetails", JSON.stringify(updatedDevelopers))

    // Notify parent component
    onDeveloperUpdated()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Developer</DialogTitle>
          <DialogDescription>Update the details for this developer.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Developer Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            {errors.name && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactPerson" className="text-right">
              Contact Person
            </Label>
            <Input
              id="contactPerson"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="col-span-3"
            />
            {errors.contactPerson && (
              <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.contactPerson}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
            {errors.email && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">
              Website
            </Label>
            <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
