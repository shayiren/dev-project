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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { v4 as uuidv4 } from "uuid"

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProject: (project: any) => void
}

export function AddProjectDialog({ open, onOpenChange, onAddProject }: AddProjectDialogProps) {
  const [name, setName] = useState("")
  const [developerName, setDeveloperName] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [totalUnits, setTotalUnits] = useState("")
  const [developers, setDevelopers] = useState<any[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load developers from localStorage
  useEffect(() => {
    try {
      const savedDevelopers = localStorage.getItem("realEstateDeveloperDetails")
      if (savedDevelopers) {
        const parsedDevelopers = JSON.parse(savedDevelopers)
        setDevelopers(parsedDevelopers)
      } else {
        setDevelopers([])
      }
    } catch (error) {
      console.error("Error loading developers:", error)
      setDevelopers([])
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Project name is required"
    if (!developerName) newErrors.developerName = "Developer name is required"
    if (!location.trim()) newErrors.location = "Location is required"
    if (totalUnits && isNaN(Number(totalUnits))) newErrors.totalUnits = "Total units must be a number"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const newProject = {
      id: uuidv4(),
      name,
      developerName,
      location,
      description,
      totalUnits: totalUnits ? Number(totalUnits) : undefined,
    }

    onAddProject(newProject)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setDeveloperName("")
    setLocation("")
    setDescription("")
    setTotalUnits("")
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>Enter the details for the new project.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Project Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            {errors.name && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="developerName" className="text-right">
              Developer
            </Label>
            <Select value={developerName} onValueChange={setDeveloperName}>
              <SelectTrigger id="developerName" className="col-span-3">
                <SelectValue placeholder="Select a developer" />
              </SelectTrigger>
              <SelectContent>
                {developers.map((developer: any) => (
                  <SelectItem key={developer.id} value={developer.name}>
                    {developer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.developerName && (
              <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.developerName}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3"
            />
            {errors.location && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.location}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalUnits" className="text-right">
              Total Units
            </Label>
            <Input
              id="totalUnits"
              type="number"
              value={totalUnits}
              onChange={(e) => setTotalUnits(e.target.value)}
              className="col-span-3"
            />
            {errors.totalUnits && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.totalUnits}</p>}
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
          <Button onClick={handleSubmit}>Add Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
