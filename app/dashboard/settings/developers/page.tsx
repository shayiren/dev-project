"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Pencil, Trash2 } from "lucide-react"

// Define the Developer type
interface Developer {
  id: string
  name: string
  description: string
  contactPerson: string
  phoneNumber: string
  email: string
  licenseNumber: string
  address: string
  logo: string
}

// Initial data
const initialDevelopers: Developer[] = [
  {
    id: "dev1",
    name: "Coastal Developments Inc.",
    description: "A leading developer of luxury waterfront properties with over 20 years of experience.",
    contactPerson: "John Smith",
    phoneNumber: "+971 50 123 4567",
    email: "info@coastaldevelopments.com",
    licenseNumber: "DEV-12345-AB",
    address: "Marina Plaza, Dubai Marina, Dubai, UAE",
    logo: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "dev2",
    name: "Premium Estates Group",
    description: "Specializing in high-end residential and commercial developments across the UAE.",
    contactPerson: "Sarah Johnson",
    phoneNumber: "+971 50 987 6543",
    email: "contact@premiumestates.com",
    licenseNumber: "DEV-67890-CD",
    address: "Business Bay, Dubai, UAE",
    logo: "/placeholder.svg?height=100&width=200",
  },
]

export default function DevelopersPage() {
  const { toast } = useToast()
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null)
  const [developerToDelete, setDeveloperToDelete] = useState<string | null>(null)
  const [formData, setFormData] = useState<Developer>({
    id: "",
    name: "",
    description: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    licenseNumber: "",
    address: "",
    logo: "/placeholder.svg?height=100&width=200",
  })

  // Load developers from localStorage on initial render
  useEffect(() => {
    try {
      const savedDevelopers = localStorage.getItem("realEstateDeveloperDetails")
      if (savedDevelopers) {
        const parsed = JSON.parse(savedDevelopers)
        if (Array.isArray(parsed)) {
          setDevelopers(parsed)
        } else {
          // If not an array, use initial data
          setDevelopers(initialDevelopers)
          localStorage.setItem("realEstateDeveloperDetails", JSON.stringify(initialDevelopers))
        }
      } else {
        setDevelopers(initialDevelopers)
        localStorage.setItem("realEstateDeveloperDetails", JSON.stringify(initialDevelopers))
      }
    } catch (error) {
      console.error("Error loading developers:", error)
      // Fall back to initial data
      setDevelopers(initialDevelopers)
      localStorage.setItem("realEstateDeveloperDetails", JSON.stringify(initialDevelopers))
    }
  }, [])

  // Save developers to localStorage whenever they change
  useEffect(() => {
    if (developers.length > 0) {
      // Save detailed developer objects
      localStorage.setItem("realEstateDeveloperDetails", JSON.stringify(developers))

      // Also save simple developer names array for compatibility with other components
      const developerNames = developers.map((dev) => dev.name)
      localStorage.setItem("developers", JSON.stringify(developerNames))
    }
  }, [developers])

  const handleInputChange = (field: keyof Developer, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload this file to a server
      // For this demo, we'll just use a placeholder
      setFormData({
        ...formData,
        logo: "/placeholder.svg?height=100&width=200",
      })

      toast({
        title: "Logo uploaded",
        description: "In a real app, this would upload to a server.",
      })
    }
  }

  const handleAddDeveloper = () => {
    setSelectedDeveloper(null)
    setFormData({
      id: "",
      name: "",
      description: "",
      contactPerson: "",
      phoneNumber: "",
      email: "",
      licenseNumber: "",
      address: "",
      logo: "/placeholder.svg?height=100&width=200",
    })
    setDialogOpen(true)
  }

  const handleEditDeveloper = (developer: Developer) => {
    setSelectedDeveloper(developer)
    setFormData({ ...developer })
    setDialogOpen(true)
  }

  const handleDeleteDeveloper = (id: string) => {
    setDeveloperToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteDeveloper = () => {
    if (developerToDelete) {
      const updatedDevelopers = developers.filter((dev) => dev.id !== developerToDelete)
      setDevelopers(updatedDevelopers)

      toast({
        title: "Developer deleted",
        description: "The developer has been successfully deleted.",
      })

      setDeleteDialogOpen(false)
      setDeveloperToDelete(null)
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.licenseNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (selectedDeveloper) {
      // Update existing developer
      const updatedDevelopers = developers.map((dev) =>
        dev.id === selectedDeveloper.id ? { ...formData, id: selectedDeveloper.id } : dev,
      )
      setDevelopers(updatedDevelopers)

      toast({
        title: "Developer updated",
        description: `${formData.name} has been successfully updated.`,
      })
    } else {
      // Add new developer
      const newDeveloper = {
        ...formData,
        id: `dev${Date.now()}`,
      }
      setDevelopers([...developers, newDeveloper])

      toast({
        title: "Developer added",
        description: `${formData.name} has been successfully added.`,
      })
    }

    setDialogOpen(false)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Management</h1>
          <p className="text-muted-foreground">Manage developer information and details</p>
        </div>
        <Button onClick={handleAddDeveloper}>
          <Plus className="mr-2 h-4 w-4" /> Add Developer
        </Button>
      </div>

      {developers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <p className="text-muted-foreground mb-4">No developers found</p>
            <Button onClick={handleAddDeveloper}>
              <Plus className="mr-2 h-4 w-4" /> Add Developer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {developers.map((developer) => (
            <Card key={developer.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                    <Image
                      src={developer.logo || "/placeholder.svg?height=100&width=100"}
                      alt={`${developer.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <CardTitle>{developer.name}</CardTitle>
                    <CardDescription>License: {developer.licenseNumber}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditDeveloper(developer)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDeleteDeveloper(developer.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground">{developer.description}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Contact Person</TableCell>
                          <TableCell>{developer.contactPerson}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Phone</TableCell>
                          <TableCell>{developer.phoneNumber}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Email</TableCell>
                          <TableCell>{developer.email}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Address</TableCell>
                          <TableCell>{developer.address}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Developer Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedDeveloper ? "Edit Developer" : "Add Developer"}</DialogTitle>
            <DialogDescription>
              {selectedDeveloper
                ? "Update the developer information below."
                : "Fill in the details to add a new developer."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Developer Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter developer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                  placeholder="Enter license number"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Developer Profile Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter description"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  placeholder="Enter contact person name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Developer Logo</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                  <Image
                    src={formData.logo || "/placeholder.svg?height=100&width=100"}
                    alt="Developer logo preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <Input id="logo" type="file" accept="image/*" onChange={handleFileChange} />
                  <p className="text-xs text-muted-foreground mt-1">Upload a logo image for the developer</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>{selectedDeveloper ? "Save Changes" : "Add Developer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Developer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this developer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDeveloper} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
