"use client"

import { useState } from "react"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"
import { loadFromStorage } from "@/utils/storage-utils"

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProject: (project: any) => void
}

export function AddProjectDialog({ open, onOpenChange, onAddProject }: AddProjectDialogProps) {
  const [projectName, setProjectName] = useState("")
  const [developerName, setDeveloperName] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [totalUnits, setTotalUnits] = useState("")
  const [completionDate, setCompletionDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState("Pre-construction")
  const [website, setWebsite] = useState("")
  const [amenities, setAmenities] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get developers from localStorage
  const developers = loadFromStorage("realEstateDeveloperDetails", [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!projectName.trim()) newErrors.projectName = "Project name is required"
    if (!developerName) newErrors.developerName = "Developer name is required"
    if (!location.trim()) newErrors.location = "Location is required"
    if (!totalUnits.trim()) newErrors.totalUnits = "Total units is required"
    else if (isNaN(Number(totalUnits)) || Number(totalUnits) <= 0) {
      newErrors.totalUnits = "Total units must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const newProject = {
      id: uuidv4(),
      name: projectName,
      developerName,
      location,
      description,
      totalUnits: Number(totalUnits),
      completionDate: completionDate ? format(completionDate, "yyyy-MM-dd") : "",
      status,
      website,
      amenities: amenities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    }

    onAddProject(newProject)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setProjectName("")
    setDeveloperName("")
    setLocation("")
    setDescription("")
    setTotalUnits("")
    setCompletionDate(undefined)
    setStatus("Pre-construction")
    setWebsite("")
    setAmenities("")
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>Enter the details for the new real estate project.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectName" className="text-right">
              Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="col-span-3"
            />
            {errors.projectName && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.projectName}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="developerName" className="text-right">
              Developer <span className="text-red-500">*</span>
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
              Location <span className="text-red-500">*</span>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalUnits" className="text-right">
              Total Units <span className="text-red-500">*</span>
            </Label>
            <Input
              id="totalUnits"
              value={totalUnits}
              onChange={(e) => setTotalUnits(e.target.value)}
              className="col-span-3"
              type="number"
            />
            {errors.totalUnits && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.totalUnits}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="completionDate" className="text-right">
              Completion Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="completionDate"
                  variant="outline"
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !completionDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {completionDate ? format(completionDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={completionDate} onSelect={setCompletionDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pre-construction">Pre-construction</SelectItem>
                <SelectItem value="Under Construction">Under Construction</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">
              Website
            </Label>
            <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amenities" className="text-right">
              Amenities
            </Label>
            <Textarea
              id="amenities"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              className="col-span-3"
              placeholder="Enter amenities separated by commas"
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
