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

interface EditProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectUpdated: () => void
  project: any | null
}

export function EditProjectDialog({ open, onOpenChange, onProjectUpdated, project }: EditProjectDialogProps) {
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

  // Load project data when the dialog opens
  useEffect(() => {
    if (project) {
      setName(project.name || "")
      setDeveloperName(project.developerName || "")
      setLocation(project.location || "")
      setDescription(project.description || "")
      setTotalUnits(project.totalUnits?.toString() || "")
    }
  }, [project])

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
    if (!validateForm() || !project) return

    const updatedProject = {
      ...project,
      name,
      developerName,
      location,
      description,
      totalUnits: totalUnits ? Number(totalUnits) : undefined,
    }

    // Get existing projects from localStorage
    const savedProjects = localStorage.getItem("projects")
    const projects = savedProjects ? JSON.parse(savedProjects) : []

    // Update the project
    const updatedProjects = projects.map((proj: any) => (proj.name === project.name ? updatedProject : proj))

    // Save back to localStorage
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // Notify parent component
    onProjectUpdated()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update the details for this project.</DialogDescription>
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
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
