"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SalesOfferPreview } from "./sales-offer-preview"
import { getAllProperties } from "@/utils/storage-utils"
import { Search, FileDown, Printer, Mail } from "lucide-react"
import { downloadSalesOfferPDF } from "@/utils/pdf-utils"

export default function SalesOfferGenerator() {
  const [properties, setProperties] = useState<any[]>([])
  const [availableProperties, setAvailableProperties] = useState<any[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [paymentPlans, setPaymentPlans] = useState<any>({})

  // Load properties and projects on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Filter properties when search query or selected project changes
  useEffect(() => {
    filterProperties()
  }, [searchQuery, selectedProject, availableProperties])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load all properties
      const allProperties = getAllProperties()
      setProperties(allProperties)

      // Filter only available properties
      const available = allProperties.filter((p) => p.status === "Available")
      setAvailableProperties(available)

      // Extract unique project names
      const uniqueProjects = Array.from(new Set(allProperties.map((p: any) => p.projectName)))
      setProjects(uniqueProjects)

      // Load payment plans from localStorage
      const savedPaymentPlans = localStorage.getItem("paymentPlans")
      if (savedPaymentPlans) {
        setPaymentPlans(JSON.parse(savedPaymentPlans))
      } else {
        // Set default payment plan if none exists
        const defaultPlan = {
          default: {
            installments: [
              { name: "Booking Amount", milestone: "Effective date", percentage: 20 },
              { name: "1st Installment", milestone: "60 days from the booking date", percentage: 5 },
              { name: "2nd Installment", milestone: "120 days from the booking date", percentage: 5 },
              {
                name: "3rd Installment",
                milestone: "180 days from the booking date. *completion of 15% Construction",
                percentage: 5,
              },
              {
                name: "4th Installment",
                milestone: "240 days from the booking date. *completion of 25% Construction",
                percentage: 5,
              },
              {
                name: "5th Installment",
                milestone: "300 days from the booking date. *completion of 40% Construction",
                percentage: 5,
              },
              {
                name: "6th Installment",
                milestone: "360 days from the booking date. * completion of 60% Construction",
                percentage: 5,
              },
              { name: "Final Amount", milestone: "Completion", percentage: 50 },
            ],
          },
        }
        setPaymentPlans(defaultPlan)
        localStorage.setItem("paymentPlans", JSON.stringify(defaultPlan))
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterProperties = () => {
    let filtered = [...availableProperties]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.unitNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.buildingName?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by selected project
    if (selectedProject !== "all") {
      filtered = filtered.filter((property) => property.projectName === selectedProject)
    }

    setFilteredProperties(filtered)
  }

  const togglePropertySelection = (id: string) => {
    setSelectedProperties((prev) => (prev.includes(id) ? prev.filter((propId) => propId !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([])
    } else {
      setSelectedProperties(filteredProperties.map((p) => p.id))
    }
  }

  const handleGenerateOffers = () => {
    if (selectedProperties.length === 0) {
      alert("Please select at least one property to generate a sales offer.")
      return
    }

    setShowPreview(true)
  }

  const downloadSelectedOffers = () => {
    // For multiple properties, create a zip file
    if (selectedProperties.length > 1) {
      alert("Downloading multiple offers as separate PDFs. Please wait...")

      // Download each PDF individually for now
      selectedProperties.forEach((propId) => {
        const property = properties.find((p) => p.id === propId)
        if (property) {
          const paymentPlan = paymentPlans[property.projectName] || paymentPlans.default
          downloadSalesOfferPDF(property, paymentPlan)
        }
      })
    } else if (selectedProperties.length === 1) {
      // Download single PDF
      const property = properties.find((p) => p.id === selectedProperties[0])
      if (property) {
        const paymentPlan = paymentPlans[property.projectName] || paymentPlans.default
        downloadSalesOfferPDF(property, paymentPlan)
      }
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Offers</h1>
          <p className="text-muted-foreground">Generate and manage sales offers for available properties</p>
        </div>
      </div>

      {!showPreview ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search properties..."
                className="w-full sm:w-[300px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleGenerateOffers} disabled={selectedProperties.length === 0}>
                Generate Offers ({selectedProperties.length})
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Available Properties</CardTitle>
              <CardDescription>Select properties to generate sales offers</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading properties...</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={
                              filteredProperties.length > 0 && selectedProperties.length === filteredProperties.length
                            }
                            onCheckedChange={toggleSelectAll}
                            aria-label="Select all"
                          />
                        </TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Phase</TableHead>
                        <TableHead>Building</TableHead>
                        <TableHead>Floor</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Beds</TableHead>
                        <TableHead>Area (sqft)</TableHead>
                        <TableHead>Price/sqft</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProperties.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center py-4">
                            No available properties found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProperties.map((property) => (
                          <TableRow key={property.id} className="bg-green-50">
                            <TableCell>
                              <Checkbox
                                checked={selectedProperties.includes(property.id)}
                                onCheckedChange={() => togglePropertySelection(property.id)}
                                aria-label={`Select ${property.unitNumber}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{property.unitNumber}</TableCell>
                            <TableCell>{property.projectName}</TableCell>
                            <TableCell>{property.phase || "Phase 1"}</TableCell>
                            <TableCell>{property.buildingName}</TableCell>
                            <TableCell>{property.floorNumber}</TableCell>
                            <TableCell>{property.unitType}</TableCell>
                            <TableCell>{property.bedrooms}</TableCell>
                            <TableCell>{property.totalArea || property.area} sqft</TableCell>
                            <TableCell>
                              {property.totalPricePerSqft ? `AED ${property.totalPricePerSqft}/sqft` : "-"}
                            </TableCell>
                            <TableCell>AED {property.price?.toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Back to Selection
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={() => downloadSelectedOffers()}>
                <FileDown className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {selectedProperties.map((propId) => {
              const property = properties.find((p) => p.id === propId)
              if (!property) return null

              // Get payment plan for this property's project
              const paymentPlan = paymentPlans[property.projectName] || paymentPlans.default

              return <SalesOfferPreview key={property.id} property={property} paymentPlan={paymentPlan} />
            })}
          </div>
        </div>
      )}
    </div>
  )
}
