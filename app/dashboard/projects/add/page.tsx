"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { useDevelopers } from "@/hooks/use-developers"

export default function AddProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { developers, isLoading, addDeveloper } = useDevelopers()
  const [isAddingDeveloper, setIsAddingDeveloper] = useState(false)
  const [newDeveloper, setNewDeveloper] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    developerName: "",
    description: "",
    location: "",
    totalUnits: "",
    phases: ["Phase 1"],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddDeveloper = () => {
    if (newDeveloper.trim() === "") {
      toast({
        title: "Error",
        description: "Developer name cannot be empty",
        variant: "destructive",
      })
      return
    }

    const success = addDeveloper(newDeveloper.trim())

    if (success) {
      setFormData({ ...formData, developerName: newDeveloper.trim() })
      setNewDeveloper("")
      setIsAddingDeveloper(false)

      toast({
        title: "Success",
        description: "Developer added successfully",
      })
    } else {
      toast({
        title: "Error",
        description: "Developer already exists",
        variant: "destructive",
      })
    }
  }

  const handleAddPhase = () => {
    const phaseNumber = formData.phases.length + 1
    setFormData({
      ...formData,
      phases: [...formData.phases, `Phase ${phaseNumber}`],
    })
  }

  const handleRemovePhase = (index: number) => {
    if (formData.phases.length <= 1) {
      toast({
        title: "Error",
        description: "Project must have at least one phase",
        variant: "destructive",
      })
      return
    }

    const updatedPhases = formData.phases.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      phases: updatedPhases,
    })
  }

  const handlePhaseChange = (index: number, value: string) => {
    const updatedPhases = [...formData.phases]
    updatedPhases[index] = value
    setFormData({
      ...formData,
      phases: updatedPhases,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name || !formData.developerName) {
        throw new Error("Project name and developer are required")
      }

      // Get existing projects from localStorage
      const savedProjects = localStorage.getItem("projects")
      const projects = savedProjects ? JSON.parse(savedProjects) : []

      // Check if project with same name already exists
      if (projects.some((p: any) => p.name === formData.name.trim())) {
        throw new Error("Project with this name already exists")
      }

      // Create new project object
      const newProject = {
        name: formData.name.trim(),
        developerName: formData.developerName,
        description: formData.description,
        location: formData.location,
        totalUnits: formData.totalUnits ? Number.parseInt(formData.totalUnits) : undefined,
        phases: formData.phases,
      }

      // Add to projects array
      projects.push(newProject)

      // Save back to localStorage
      localStorage.setItem("projects", JSON.stringify(projects))

      toast({
        title: "Project added",
        description: "The project has been successfully added.",
      })

      // Redirect back to projects page
      router.push("/dashboard/projects")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add project",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Add New Project</h1>
        <Button onClick={() => router.push("/dashboard/projects")}>Back to Projects</Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="details">Project Details</TabsTrigger>
            <TabsTrigger value="phases">Phases</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>Enter the basic information about the project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="developerName">Developer *</Label>
                    {isLoading ? (
                      <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                    ) : (
                      <>
                        <select
                          id="developerName"
                          name="developerName"
                          value={formData.developerName}
                          onChange={(e) => handleSelectChange("developerName", e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="">Select Developer</option>
                          {developers.map((dev) => (
                            <option key={dev} value={dev}>
                              {dev}
                            </option>
                          ))}
                        </select>
                        {developers.length === 0 && (
                          <p className="text-sm text-red-500 mt-1">No developers found. Please add a developer.</p>
                        )}
                      </>
                    )}

                    {isAddingDeveloper ? (
                      <div className="space-y-2 mt-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter new developer name"
                            value={newDeveloper}
                            onChange={(e) => setNewDeveloper(e.target.value)}
                          />
                          <Button type="button" onClick={handleAddDeveloper}>
                            Add
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setIsAddingDeveloper(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setIsAddingDeveloper(true)}
                      >
                        Add New Developer
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalUnits">Total Units</Label>
                    <Input
                      id="totalUnits"
                      name="totalUnits"
                      type="number"
                      value={formData.totalUnits}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phases">
            <Card>
              <CardHeader>
                <CardTitle>Project Phases</CardTitle>
                <CardDescription>Define the phases for this project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.phases.map((phase, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="flex-1">
                      <Label htmlFor={`phase-${index}`}>Phase {index + 1}</Label>
                      <Input
                        id={`phase-${index}`}
                        value={phase}
                        onChange={(e) => handlePhaseChange(index, e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="mt-6"
                      onClick={() => handleRemovePhase(index)}
                    >
                      X
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddPhase}>
                  Add Phase
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Project"}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  )
}
