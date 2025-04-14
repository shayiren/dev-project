"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploader } from "@/components/file-uploader"
import { Plus, Trash, Save } from "lucide-react"

type Phase = {
  id: string
  name: string
  description: string
  releaseDate: string
  totalUnits: number
}

type Project = {
  id: string
  name: string
  description: string
  developerName: string
  location: string
  totalUnits: number
  images: string[]
  floorPlates: string[]
  phases: Phase[]
  paymentPlan: {
    type: "default" | "custom"
    installments: {
      name: string
      percentage: number
      dueDate: string
      description: string
    }[]
  }
}

export default function ProjectDetailsPage() {
  const router = useRouter()
  const [developers, setDevelopers] = useState<string[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [project, setProject] = useState<Project>({
    id: "",
    name: "",
    description: "",
    developerName: "",
    location: "",
    totalUnits: 0,
    images: [],
    floorPlates: [],
    phases: [],
    paymentPlan: {
      type: "default",
      installments: [
        { name: "Booking", percentage: 20, dueDate: "", description: "Due at booking" },
        { name: "Construction", percentage: 40, dueDate: "", description: "Due at construction milestone" },
        { name: "Handover", percentage: 40, dueDate: "", description: "Due at handover" },
      ],
    },
  })
  const [newPhase, setNewPhase] = useState<Omit<Phase, "id">>({
    name: "",
    description: "",
    releaseDate: "",
    totalUnits: 0,
  })
  const [installmentCount, setInstallmentCount] = useState<string>("3")

  // Load developers and projects from localStorage on component mount
  useEffect(() => {
    // Load developers from localStorage
    try {
      const savedDevelopers = localStorage.getItem("realEstateDeveloperDetails")
      if (savedDevelopers) {
        const parsed = JSON.parse(savedDevelopers)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Extract developer names
          const developerNames = parsed.map((dev) => dev.name)
          setDevelopers(developerNames)
        } else {
          // Try the simpler format
          const simpleDevelopers = localStorage.getItem("developers")
          if (simpleDevelopers) {
            setDevelopers(JSON.parse(simpleDevelopers))
          }
        }
      } else {
        // Try the simpler format
        const simpleDevelopers = localStorage.getItem("developers")
        if (simpleDevelopers) {
          setDevelopers(JSON.parse(simpleDevelopers))
        }
      }
    } catch (error) {
      console.error("Error loading developers:", error)
    }

    const savedProjects = localStorage.getItem("projectDetails")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  // Update project when selectedProjectId changes
  useEffect(() => {
    if (selectedProjectId) {
      const selectedProject = projects.find((p) => p.id === selectedProjectId)
      if (selectedProject) {
        setProject(selectedProject)

        // Set installment count based on the project's payment plan
        if (selectedProject.paymentPlan.installments.length) {
          setInstallmentCount(selectedProject.paymentPlan.installments.length.toString())
        }
      }
    }
  }, [selectedProjectId, projects])

  // Update installments when installment count or payment plan type changes
  useEffect(() => {
    if (project.paymentPlan.type === "default") {
      let defaultInstallments = []
      const count = Number.parseInt(installmentCount)

      if (count === 3) {
        defaultInstallments = [
          { name: "Booking", percentage: 40, dueDate: "", description: "Due at booking" },
          { name: "Construction", percentage: 30, dueDate: "", description: "Due at construction milestone" },
          { name: "Handover", percentage: 30, dueDate: "", description: "Due at handover" },
        ]
      } else if (count === 4) {
        defaultInstallments = [
          { name: "Booking", percentage: 30, dueDate: "", description: "Due at booking" },
          { name: "Construction Start", percentage: 20, dueDate: "", description: "Due at construction start" },
          { name: "Construction Milestone", percentage: 20, dueDate: "", description: "Due at construction milestone" },
          { name: "Handover", percentage: 30, dueDate: "", description: "Due at handover" },
        ]
      } else {
        // Create generic installments for other counts
        defaultInstallments = Array.from({ length: count }, (_, i) => {
          if (i === 0) {
            return { name: "Booking", percentage: Math.floor(100 / count), dueDate: "", description: "Due at booking" }
          } else if (i === count - 1) {
            return {
              name: "Handover",
              percentage: Math.floor(100 / count),
              dueDate: "",
              description: "Due at handover",
            }
          } else {
            return {
              name: `Installment ${i}`,
              percentage: Math.floor(100 / count),
              dueDate: "",
              description: `Installment ${i}`,
            }
          }
        })

        // Adjust percentages to ensure they sum to 100%
        const sum = defaultInstallments.reduce((acc, curr) => acc + curr.percentage, 0)
        if (sum < 100 && defaultInstallments.length > 0) {
          defaultInstallments[defaultInstallments.length - 1].percentage += 100 - sum
        }
      }

      setProject((prev) => ({
        ...prev,
        paymentPlan: {
          ...prev.paymentPlan,
          installments: defaultInstallments,
        },
      }))
    } else if (project.paymentPlan.type === "custom") {
      // For custom payment plans, adjust the number of installments
      const count = Number.parseInt(installmentCount)
      const currentInstallments = [...project.paymentPlan.installments]

      if (currentInstallments.length < count) {
        // Add more installments
        const newInstallments = [...currentInstallments]
        for (let i = currentInstallments.length; i < count; i++) {
          newInstallments.push({
            name: `Installment ${i + 1}`,
            percentage: 0,
            dueDate: "",
            description: `Installment ${i + 1}`,
          })
        }
        setProject((prev) => ({
          ...prev,
          paymentPlan: {
            ...prev.paymentPlan,
            installments: newInstallments,
          },
        }))
      } else if (currentInstallments.length > count) {
        // Remove excess installments
        setProject((prev) => ({
          ...prev,
          paymentPlan: {
            ...prev.paymentPlan,
            installments: currentInstallments.slice(0, count),
          },
        }))
      }
    }
  }, [installmentCount, project.paymentPlan.type])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProject((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProject((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentPlanTypeChange = (value: "default" | "custom") => {
    setProject((prev) => ({
      ...prev,
      paymentPlan: {
        ...prev.paymentPlan,
        type: value,
      },
    }))
  }

  const handleInstallmentChange = (index: number, field: string, value: string | number) => {
    setProject((prev) => {
      const updatedInstallments = [...prev.paymentPlan.installments]
      updatedInstallments[index] = {
        ...updatedInstallments[index],
        [field]: value,
      }
      return {
        ...prev,
        paymentPlan: {
          ...prev.paymentPlan,
          installments: updatedInstallments,
        },
      }
    })
  }

  const handleNewPhaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPhase((prev) => ({
      ...prev,
      [name]: name === "totalUnits" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const addPhase = () => {
    if (newPhase.name) {
      const phase = {
        id: Date.now().toString(),
        ...newPhase,
      }

      setProject((prev) => ({
        ...prev,
        phases: [...prev.phases, phase],
      }))

      // Reset new phase form
      setNewPhase({
        name: "",
        description: "",
        releaseDate: "",
        totalUnits: 0,
      })
    }
  }

  const removePhase = (id: string) => {
    setProject((prev) => ({
      ...prev,
      phases: prev.phases.filter((phase) => phase.id !== id),
    }))
  }

  const handleImageUpload = (file: File | null) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProject((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }))
    }
  }

  const handleFloorPlateUpload = (file: File | null) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProject((prev) => ({
        ...prev,
        floorPlates: [...prev.floorPlates, imageUrl],
      }))
    }
  }

  const saveProject = () => {
    if (!project.name || !project.developerName) {
      alert("Please fill in all required fields")
      return
    }

    // Check if we're editing an existing project or creating a new one
    if (selectedProjectId) {
      // Update existing project
      const updatedProjects = projects.map((p) => (p.id === selectedProjectId ? project : p))
      setProjects(updatedProjects)
      localStorage.setItem("projectDetails", JSON.stringify(updatedProjects))
    } else {
      // Create new project
      const newProject = {
        ...project,
        id: Date.now().toString(),
      }
      const updatedProjects = [...projects, newProject]
      setProjects(updatedProjects)
      localStorage.setItem("projectDetails", JSON.stringify(updatedProjects))

      // Update project names list
      const projectNames = updatedProjects.map((p) => p.name)
      localStorage.setItem("projects", JSON.stringify(projectNames))

      // Select the new project
      setSelectedProjectId(newProject.id)
    }

    alert("Project saved successfully")
  }

  const createNewProject = () => {
    setSelectedProjectId("")
    setProject({
      id: "",
      name: "",
      description: "",
      developerName: "",
      location: "",
      totalUnits: 0,
      images: [],
      floorPlates: [],
      phases: [],
      paymentPlan: {
        type: "default",
        installments: [
          { name: "Booking", percentage: 20, dueDate: "", description: "Due at booking" },
          { name: "Construction", percentage: 40, dueDate: "", description: "Due at construction milestone" },
          { name: "Handover", percentage: 40, dueDate: "", description: "Due at handover" },
        ],
      },
    })
    setInstallmentCount("3")
  }

  // Calculate total percentage for payment plan
  const totalPercentage = project.paymentPlan.installments.reduce((sum, installment) => sum + installment.percentage, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground">Manage project details, phases, and payment plans.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={createNewProject} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
          <Button onClick={saveProject} className="w-full md:w-auto">
            <Save className="mr-2 h-4 w-4" />
            Save Project
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="selectedProject">Select Project</Label>
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger id="selectedProject">
            <SelectValue placeholder="Select a project or create new" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((proj) => (
              <SelectItem key={proj.id} value={proj.id}>
                {proj.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="payment">Payment Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Enter the basic information about the project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input id="name" name="name" value={project.name} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="developerName">Developer *</Label>
                  <Select
                    name="developerName"
                    value={project.developerName}
                    onValueChange={(value) => handleSelectChange("developerName", value)}
                    required
                  >
                    <SelectTrigger id="developerName">
                      <SelectValue placeholder="Select Developer" />
                    </SelectTrigger>
                    <SelectContent>
                      {developers.map((dev) => (
                        <SelectItem key={dev} value={dev}>
                          {dev}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={project.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={project.location} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalUnits">Total Units</Label>
                  <Input
                    id="totalUnits"
                    name="totalUnits"
                    type="number"
                    value={project.totalUnits}
                    onChange={(e) => handleSelectChange("totalUnits", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Project Images</Label>
                  <FileUploader onFileSelect={handleImageUpload} accept="image/*" maxSize={5} />
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {project.images.map((image, index) => (
                      <div key={index} className="relative aspect-video bg-muted rounded-md overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Project image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Floor Plates</Label>
                  <FileUploader onFileSelect={handleFloorPlateUpload} accept="image/*" maxSize={5} />
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {project.floorPlates.map((image, index) => (
                      <div key={index} className="relative aspect-video bg-muted rounded-md overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Floor plate ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Phases</CardTitle>
              <CardDescription>Manage the different phases of your project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {project.phases.length > 0 ? (
                  <div className="space-y-4">
                    {project.phases.map((phase) => (
                      <Card key={phase.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{phase.name}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => removePhase(phase.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardDescription>{phase.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Release Date:</p>
                              <p>{phase.releaseDate || "Not set"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Units:</p>
                              <p>{phase.totalUnits}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No phases added yet. Add a phase below.</div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Add New Phase</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phaseName">Phase Name *</Label>
                        <Input
                          id="phaseName"
                          name="name"
                          value={newPhase.name}
                          onChange={handleNewPhaseChange}
                          placeholder="e.g., Phase 1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phaseReleaseDate">Release Date</Label>
                        <Input
                          id="phaseReleaseDate"
                          name="releaseDate"
                          type="date"
                          value={newPhase.releaseDate}
                          onChange={handleNewPhaseChange}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="phaseDescription">Description</Label>
                        <Textarea
                          id="phaseDescription"
                          name="description"
                          value={newPhase.description}
                          onChange={handleNewPhaseChange}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phaseTotalUnits">Total Units</Label>
                        <Input
                          id="phaseTotalUnits"
                          name="totalUnits"
                          type="number"
                          value={newPhase.totalUnits || ""}
                          onChange={handleNewPhaseChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={addPhase} disabled={!newPhase.name}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Phase
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Plan</CardTitle>
              <CardDescription>Configure the payment plan for this project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentPlanType">Payment Plan Type</Label>
                  <Select
                    value={project.paymentPlan.type}
                    onValueChange={(value: "default" | "custom") => handlePaymentPlanTypeChange(value)}
                  >
                    <SelectTrigger id="paymentPlanType">
                      <SelectValue placeholder="Select Payment Plan Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Payment Plan</SelectItem>
                      <SelectItem value="custom">Custom Payment Plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installmentCount">Number of Installments</Label>
                  <Select value={installmentCount} onValueChange={setInstallmentCount}>
                    <SelectTrigger id="installmentCount">
                      <SelectValue placeholder="Select Number of Installments" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {project.paymentPlan.type === "default" &&
                      "Preset payment plans are available for 3 and 4 installments."}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Installments</h3>
                    <div className={`text-sm ${totalPercentage === 100 ? "text-green-600" : "text-red-600"}`}>
                      Total: {totalPercentage}%
                    </div>
                  </div>

                  {project.paymentPlan.installments.map((installment, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md">
                      <div className="space-y-2">
                        <Label htmlFor={`installmentName-${index}`}>Name</Label>
                        <Input
                          id={`installmentName-${index}`}
                          value={installment.name}
                          onChange={(e) => handleInstallmentChange(index, "name", e.target.value)}
                          disabled={project.paymentPlan.type === "default"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`installmentPercentage-${index}`}>Percentage (%)</Label>
                        <Input
                          id={`installmentPercentage-${index}`}
                          type="number"
                          value={installment.percentage}
                          onChange={(e) =>
                            handleInstallmentChange(index, "percentage", Number.parseInt(e.target.value) || 0)
                          }
                          disabled={project.paymentPlan.type === "default"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`installmentDueDate-${index}`}>Due Date</Label>
                        <Input
                          id={`installmentDueDate-${index}`}
                          type="date"
                          value={installment.dueDate}
                          onChange={(e) => handleInstallmentChange(index, "dueDate", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`installmentDescription-${index}`}>Description</Label>
                        <Input
                          id={`installmentDescription-${index}`}
                          value={installment.description}
                          onChange={(e) => handleInstallmentChange(index, "description", e.target.value)}
                          disabled={project.paymentPlan.type === "default"}
                        />
                      </div>
                    </div>
                  ))}

                  {totalPercentage !== 100 && project.paymentPlan.type === "custom" && (
                    <p className="text-sm text-red-600">
                      The total percentage must equal 100%. Current total: {totalPercentage}%
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
