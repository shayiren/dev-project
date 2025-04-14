"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "@/components/file-uploader"
import { useToast } from "@/components/ui/use-toast"
import { type ClientInformation, ClientInformationForm } from "@/components/client-information-form"
import { formatCurrency } from "@/lib/format-currency"
import { useDevelopers } from "@/hooks/use-developers"
import { addProperty } from "@/utils/storage-utils"

export default function AddPropertyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { developers, isLoading: isLoadingDevelopers, addDeveloper } = useDevelopers()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<Array<{ name: string; developerName: string }>>([])
  const [phases, setPhases] = useState<string[]>([])
  const [formData, setFormData] = useState({
    unitNumber: "",
    title: "",
    description: "",
    projectName: "",
    developerName: "",
    buildingName: "",
    phase: "",
    floorNumber: "",
    location: "",
    price: "",
    type: "Apartment",
    unitType: "Apartment",
    bedrooms: "",
    bathrooms: "",
    area: "",
    internalArea: "",
    externalArea: "",
    internalPricePerSqft: "",
    externalPricePerSqft: "",
    totalPricePerSqft: "",
    views: "",
    floorPlate: "",
    status: "Available",
    floorPlan: null as File | null,
    imageUrl: "/placeholder.svg?height=400&width=600",
  })

  const [clientInfo, setClientInfo] = useState<ClientInformation>({
    firstName: "",
    lastName: "",
    agencyName: "",
    passportNo: "",
    emiratesId: "",
    phoneNumber: "",
    email: "",
    registrationDate: new Date(),
    residencyDetails: "",
    isAgency: false,
  })

  // Add this state for the new developer input
  const [newDeveloperName, setNewDeveloperName] = useState("")
  const [isAddingDeveloper, setIsAddingDeveloper] = useState(false)
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)

  // Format price using the standalone utility function
  const formatPrice = (price: number) => formatCurrency(price, "USD")

  // Add this function to handle adding a new developer
  const handleAddDeveloper = () => {
    if (newDeveloperName.trim()) {
      const success = addDeveloper(newDeveloperName.trim())

      if (success) {
        setFormData({ ...formData, developerName: newDeveloperName.trim() })
        setNewDeveloperName("")
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
  }

  // Load projects from localStorage on component mount
  useEffect(() => {
    setIsLoadingProjects(true)

    // Default projects as fallback
    const defaultProjects = [
      { name: "Sunset Residences", developerName: "Prime Developers" },
      { name: "Ocean View Towers", developerName: "Prime Developers" },
      { name: "Urban Heights", developerName: "City Builders" },
      { name: "Downtown Lofts", developerName: "City Builders" },
      { name: "Metro Gardens", developerName: "Metro Construction" },
      { name: "City Center Plaza", developerName: "Metro Construction" },
    ]

    try {
      const savedProjects = localStorage.getItem("projects")
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects)
        if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
          // If we have a selected developer, filter projects by that developer
          if (formData.developerName) {
            const filteredProjects = parsedProjects.filter((p) => p.developerName === formData.developerName)
            setProjects(filteredProjects)
          } else {
            setProjects(parsedProjects)
          }
        } else {
          setProjects(defaultProjects)
          localStorage.setItem("projects", JSON.stringify(defaultProjects))
        }
      } else {
        setProjects(defaultProjects)
        localStorage.setItem("projects", JSON.stringify(defaultProjects))
      }
    } catch (error) {
      console.error("Error parsing projects from localStorage:", error)
      setProjects(defaultProjects)
      localStorage.setItem("projects", JSON.stringify(defaultProjects))
    } finally {
      setIsLoadingProjects(false)
    }

    // Set default phases
    if (phases.length === 0) {
      setPhases(["Phase 1", "Phase 2", "Phase 3", "Phase 4"])
    }
  }, [formData.developerName, phases.length])

  // Update projects when developer changes
  useEffect(() => {
    if (formData.developerName) {
      try {
        const savedProjects = localStorage.getItem("projects")
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects)
          if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
            const filteredProjects = parsedProjects.filter((p) => p.developerName === formData.developerName)
            setProjects(filteredProjects)
          }
        }
      } catch (error) {
        console.error("Error filtering projects:", error)
      }
    }
  }, [formData.developerName])

  const handleChange = (field: string, value: string) => {
    if (field === "projectName") {
      // Auto-select the developer based on the selected project
      const selectedProject = projects.find((project) => project.name === value)
      if (selectedProject) {
        setFormData({
          ...formData,
          projectName: value,
          developerName: selectedProject.developerName,
        })
      } else {
        setFormData({
          ...formData,
          [field]: value,
        })
      }
    } else if (field === "status") {
      // If changing to Active or Developer Hold, reset client info
      if (value === "Active" || value === "Developer Hold") {
        setClientInfo({
          firstName: "",
          lastName: "",
          agencyName: "",
          passportNo: "",
          emiratesId: "",
          phoneNumber: "",
          email: "",
          registrationDate: new Date(),
          residencyDetails: "",
          isAgency: false,
        })
      }
      setFormData({
        ...formData,
        [field]: value,
      })
    } else {
      setFormData({
        ...formData,
        [field]: value,
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, floorPlan: file }))
  }

  const handleImageChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload this file to a server
      // For this demo, we'll just use a placeholder
      setFormData({
        ...formData,
        [field]: "/placeholder.svg?height=400&width=600",
      })

      toast({
        title: `${field === "floorPlan" ? "Floor plan" : "Property image"} uploaded`,
        description: "In a real app, this would upload to a server.",
      })
    }
  }

  // Calculate derived values when area, internalArea, or price changes
  useEffect(() => {
    const totalArea = Number(formData.area)
    const internalArea = Number(formData.internalArea)
    const price = Number(formData.price)

    if (formData.area && formData.internalArea && price) {
      const externalArea = totalArea - internalArea

      // Only update if values are valid
      if (totalArea > 0 && internalArea > 0 && price > 0 && internalArea <= totalArea) {
        const totalPricePerSqft = Math.round(price / totalArea)
        const internalPricePerSqft = Math.round((price * 0.8) / internalArea) // Assuming 80% of value is in internal area
        const externalPricePerSqft = Math.round((price * 0.2) / externalArea) // Assuming 20% of value is in external area

        setFormData({
          ...formData,
          externalArea: String(externalArea),
          totalPricePerSqft: String(totalPricePerSqft),
          internalPricePerSqft: String(internalPricePerSqft),
          externalPricePerSqft: String(externalPricePerSqft),
        })
      }
    }
  }, [formData.area, formData.internalArea])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (
        !formData.title ||
        !formData.location ||
        !formData.price ||
        !formData.projectName ||
        !formData.developerName
      ) {
        throw new Error("Please fill in all required fields")
      }

      // Validate client info if status is Pending or Sold
      if (
        (formData.status === "Pending" || formData.status === "Sold") &&
        (!clientInfo.firstName || !clientInfo.lastName || !clientInfo.registrationDate)
      ) {
        throw new Error("Please provide client information for this status")
      }

      // Create new property object
      const newProperty = {
        id: Date.now().toString(),
        unitNumber: formData.unitNumber,
        title: formData.title,
        description: formData.description,
        projectName: formData.projectName,
        developerName: formData.developerName,
        buildingName: formData.buildingName,
        phase: formData.phase,
        floorNumber: Number.parseInt(formData.floorNumber) || 0,
        location: formData.location,
        unitType: formData.unitType,
        bedrooms: Number.parseInt(formData.bedrooms) || 0,
        bathrooms: Number.parseInt(formData.bathrooms) || 0,
        area: Number(formData.area),
        internalArea: Number.parseInt(formData.internalArea) || 0,
        externalArea: Number.parseInt(formData.externalArea) || 0,
        totalArea: (Number.parseInt(formData.internalArea) || 0) + (Number.parseInt(formData.externalArea) || 0),
        price: Number.parseInt(formData.price) || 0,
        internalAreaPrice:
          Number.parseInt(formData.internalArea) && Number.parseInt(formData.price)
            ? Math.round(Number.parseInt(formData.price) / Number.parseInt(formData.internalArea))
            : 0,
        status: formData.status,
        floorPlan: formData.floorPlan ? URL.createObjectURL(formData.floorPlan) : null,
        imageUrl: formData.imageUrl,
        createdAt: new Date().toISOString().split("T")[0],
        clientInfo: formData.status === "Pending" || formData.status === "Sold" ? clientInfo : null,
      }

      // Add to properties array using our utility function
      const success = addProperty(newProperty)

      if (!success) {
        throw new Error("Failed to save property to storage")
      }

      toast({
        title: "Unit added",
        description: "The unit has been successfully added to your inventory.",
      })

      // Redirect back to properties page
      router.push("/dashboard/properties")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add unit",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Property</h1>
          <p className="text-muted-foreground">Fill in the details below to add a new property to the inventory.</p>
        </div>
        <Button onClick={() => router.push("/dashboard/properties")}>Back to Properties</Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-2 md:w-[400px] mb-6">
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="media">Media & Documents</TabsTrigger>
          <TabsTrigger value="unit-info">Unit Information</TabsTrigger>
          <TabsTrigger value="client-info">Client Information</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>Enter the basic information about the property.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="unitNumber">Unit Number *</Label>
                    <Input
                      id="unitNumber"
                      name="unitNumber"
                      value={formData.unitNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="developerName">Developer *</Label>
                    {isLoadingDevelopers ? (
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
                            value={newDeveloperName}
                            onChange={(e) => setNewDeveloperName(e.target.value)}
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
                    <Label htmlFor="projectName">Project *</Label>
                    {isLoadingProjects ? (
                      <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                    ) : (
                      <select
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={(e) => handleSelectChange("projectName", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select Project</option>
                        {projects.map((proj) => (
                          <option key={proj.name} value={proj.name}>
                            {proj.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phase">Phase *</Label>
                    <select
                      id="phase"
                      name="phase"
                      value={formData.phase}
                      onChange={(e) => handleSelectChange("phase", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select Phase</option>
                      {phases.map((phase) => (
                        <option key={phase} value={phase}>
                          {phase}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildingName">Building Name *</Label>
                    <Input
                      id="buildingName"
                      name="buildingName"
                      value={formData.buildingName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="floorNumber">Floor Number *</Label>
                    <Input
                      id="floorNumber"
                      name="floorNumber"
                      type="number"
                      value={formData.floorNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unitType">Unit Type *</Label>
                    <select
                      id="unitType"
                      name="unitType"
                      value={formData.unitType}
                      onChange={(e) => handleSelectChange("unitType", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select Unit Type</option>
                      <option value="Studio">Studio</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internalArea">Internal Area (sqft) *</Label>
                    <Input
                      id="internalArea"
                      name="internalArea"
                      type="number"
                      value={formData.internalArea}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="externalArea">External Area (sqft)</Label>
                    <Input
                      id="externalArea"
                      name="externalArea"
                      type="number"
                      value={formData.externalArea}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => handleSelectChange("status", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Sold">Sold</option>
                      <option value="Under Offer">Under Offer</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Media & Documents</CardTitle>
                <CardDescription>Upload floor plans and other media for the property.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Floor Plan</Label>
                  <FileUploader onFileSelect={handleFileChange} accept="image/*" maxSize={5} />
                  <p className="text-sm text-muted-foreground">Upload a floor plan image (max 5MB).</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unit-info">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Unit Information</CardTitle>
                  <CardDescription>Basic details about the unit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Unit Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Modern Apartment Building"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName2">Project Name *</Label>
                      <select
                        id="projectName2"
                        value={formData.projectName}
                        onChange={(e) => handleChange("projectName", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select project</option>
                        {projects.map((project) => (
                          <option key={project.name} value={project.name}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="developerName2">Developer Name</Label>
                      <select
                        id="developerName2"
                        value={formData.developerName}
                        onChange={(e) => handleChange("developerName", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select Developer</option>
                        {developers.map((developer) => (
                          <option key={developer} value={developer}>
                            {developer}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the unit"
                      className="min-h-[120px]"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g. Miami Beach, FL"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Unit Type *</Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => handleChange("type", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Condo">Condo</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Building">Building</option>
                        <option value="Complex">Complex</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status2">Status</Label>
                      <select
                        id="status2"
                        value={formData.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Sold">Sold</option>
                        <option value="Developer Hold">Developer Hold</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Unit Details</CardTitle>
                  <CardDescription>Specific details and pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder="e.g. 3"
                        value={formData.bedrooms}
                        onChange={(e) => handleChange("bedrooms", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        placeholder="e.g. 2"
                        value={formData.bathrooms}
                        onChange={(e) => handleChange("bathrooms", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (AED) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="e.g. 450000"
                        value={formData.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="views">Views</Label>
                      <Input
                        id="views"
                        placeholder="e.g. Ocean, City, Park"
                        value={formData.views}
                        onChange={(e) => handleChange("views", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="floorPlate">Floor Plate</Label>
                      <Input
                        id="floorPlate"
                        placeholder="e.g. A, B, C"
                        value={formData.floorPlate}
                        onChange={(e) => handleChange("floorPlate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area">Total Area (sqft) *</Label>
                      <Input
                        id="area"
                        type="number"
                        placeholder="e.g. 1200"
                        value={formData.area}
                        onChange={(e) => handleChange("area", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internalArea">Internal Area (sqft)</Label>
                      <Input
                        id="internalArea"
                        type="number"
                        placeholder="e.g. 950"
                        value={formData.internalArea}
                        onChange={(e) => handleChange("internalArea", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="externalArea">External Area (sqft)</Label>
                      <Input
                        id="externalArea"
                        type="number"
                        placeholder="e.g. 250"
                        value={formData.externalArea}
                        onChange={(e) => handleChange("externalArea", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="internalPricePerSqft">Internal Price/Sqft</Label>
                      <Input
                        id="internalPricePerSqft"
                        type="number"
                        placeholder="e.g. 400"
                        value={formData.internalPricePerSqft}
                        onChange={(e) => handleChange("internalPricePerSqft", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="externalPricePerSqft">External Price/Sqft</Label>
                      <Input
                        id="externalPricePerSqft"
                        type="number"
                        placeholder="e.g. 200"
                        value={formData.externalPricePerSqft}
                        onChange={(e) => handleChange("externalPricePerSqft", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalPricePerSqft">Total Price/Sqft</Label>
                      <Input
                        id="totalPricePerSqft"
                        type="number"
                        placeholder="e.g. 375"
                        value={formData.totalPricePerSqft}
                        onChange={(e) => handleChange("totalPricePerSqft", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floorPlan">Floor Plan</Label>
                    <Input
                      id="floorPlan"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange("floorPlan", e)}
                    />
                    <p className="text-xs text-muted-foreground">Upload a floor plan image</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyImage">Unit Image</Label>
                    <Input
                      id="propertyImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange("imageUrl", e)}
                    />
                    <p className="text-xs text-muted-foreground">Upload a main image for the unit</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="client-info">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>
                  {formData.status === "Pending" || formData.status === "Sold"
                    ? "Add client details for this unit"
                    : "Client information is only available for units with Pending or Sold status"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formData.status === "Active" || formData.status === "Developer Hold" ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Client information is only available for units with Pending or Sold status.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Change the unit status to Pending or Sold to add client information.
                    </p>
                  </div>
                ) : (
                  <ClientInformationForm clientInfo={clientInfo} onChange={setClientInfo} isRequired={true} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Unit"}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
