"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllPropertiesExceptSold } from "@/utils/storage-utils"
import { SalesOfferPreview } from "./sales-offer-preview"
import { downloadSalesOfferPDF } from "@/utils/pdf-utils"
import { Search, FileText, Download, Printer } from "lucide-react"

export default function SalesOfferGenerator() {
  const [properties, setProperties] = useState<any[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [projectFilter, setProjectFilter] = useState("all")
  const [projects, setProjects] = useState<string[]>([])
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null)
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<any | null>(null)
  const [paymentPlans, setPaymentPlans] = useState<any[]>([
    {
      id: "plan1",
      name: "Standard Payment Plan",
      description: "40/60 Payment Plan",
      installments: [
        { name: "Booking", milestone: "On Booking", percentage: 10 },
        { name: "1st Installment", milestone: "Within 30 days", percentage: 10 },
        { name: "2nd Installment", milestone: "Within 60 days", percentage: 10 },
        { name: "3rd Installment", milestone: "Within 90 days", percentage: 10 },
        { name: "Final Payment", milestone: "On Handover", percentage: 60 },
      ],
    },
    {
      id: "plan2",
      name: "Extended Payment Plan",
      description: "30/70 Payment Plan",
      installments: [
        { name: "Booking", milestone: "On Booking", percentage: 10 },
        { name: "1st Installment", milestone: "Within 30 days", percentage: 5 },
        { name: "2nd Installment", milestone: "Within 60 days", percentage: 5 },
        { name: "3rd Installment", milestone: "Within 90 days", percentage: 5 },
        { name: "4th Installment", milestone: "Within 120 days", percentage: 5 },
        { name: "Final Payment", milestone: "On Handover", percentage: 70 },
      ],
    },
  ])

  // Load properties on component mount
  useEffect(() => {
    loadProperties()
  }, [])

  // Load properties from localStorage
  const loadProperties = () => {
    try {
      // Get all properties except sold ones
      const availableProperties = getAllPropertiesExceptSold()
      setProperties(availableProperties)
      setFilteredProperties(availableProperties)

      // Extract unique project names
      const uniqueProjects = Array.from(new Set(availableProperties.map((p) => p.projectName))).filter(Boolean)
      setProjects(uniqueProjects)
    } catch (error) {
      console.error("Error loading properties:", error)
      setProperties([])
      setFilteredProperties([])
    }
  }

  // Filter properties based on search query and project filter
  useEffect(() => {
    let filtered = [...properties]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.unitNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.buildingName?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply project filter
    if (projectFilter !== "all") {
      filtered = filtered.filter((property) => property.projectName === projectFilter)
    }

    setFilteredProperties(filtered)
  }, [searchQuery, projectFilter, properties])

  // Toggle property selection
  const togglePropertySelection = (id: string) => {
    setSelectedProperties((prev) => {
      if (prev.includes(id)) {
        return prev.filter((propId) => propId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([])
    } else {
      setSelectedProperties(filteredProperties.map((p) => p.id))
    }
  }

  // Generate offer for a single property
  const generateOffer = (property: any) => {
    setSelectedProperty(property)
    setSelectedPaymentPlan(paymentPlans[0]) // Default to first payment plan
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Handle download PDF
  const handleDownloadPDF = () => {
    if (selectedProperty && selectedPaymentPlan) {
      downloadSalesOfferPDF(selectedProperty, selectedPaymentPlan)
    }
  }

  // Format area
  const formatArea = (area: number) => {
    if (!area) return "-"
    return `${area.toLocaleString()} sqft`
  }

  // Format price
  const formatPrice = (price: number) => {
    if (!price) return "-"
    return `AED ${price.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Sales Offers</h1>
        <p className="text-muted-foreground">Generate and manage sales offers for available properties</p>
      </div>

      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList>
          <TabsTrigger value="properties">Available Properties</TabsTrigger>
          <TabsTrigger value="offers" disabled={!selectedProperty}>
            Offer Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Projects" />
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

            <Button
              className="ml-auto"
              disabled={selectedProperties.length === 0}
              onClick={() => {
                if (selectedProperties.length === 1) {
                  const property = properties.find((p) => p.id === selectedProperties[0])
                  if (property) {
                    generateOffer(property)
                  }
                }
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Offers ({selectedProperties.length})
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Available Properties</CardTitle>
              <CardDescription>Select properties to generate sales offers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
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
                      <TableHead className="hidden md:table-cell">Phase</TableHead>
                      <TableHead className="hidden md:table-cell">Building</TableHead>
                      <TableHead className="hidden md:table-cell">Floor</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Beds</TableHead>
                      <TableHead className="hidden md:table-cell">Area (sqft)</TableHead>
                      <TableHead className="hidden md:table-cell">Price/sqft</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="h-24 text-center">
                          No properties found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProperties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedProperties.includes(property.id)}
                              onCheckedChange={() => togglePropertySelection(property.id)}
                              aria-label={`Select ${property.unitNumber}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{property.unitNumber}</TableCell>
                          <TableCell>{property.projectName}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.phase || "Phase 1"}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.buildingName || "-"}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.floorNumber || "-"}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {property.unitType || property.propertyType || "-"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{property.bedrooms || "-"}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatArea(property.totalArea || property.area)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {property.pricePerSqft ? formatPrice(property.pricePerSqft) : "-"}
                          </TableCell>
                          <TableCell>{formatPrice(property.price)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => generateOffer(property)}
                              className="h-8 w-8 p-0"
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Generate offer</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          {selectedProperty && selectedPaymentPlan && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Sales Offer Preview</h2>
                  <p className="text-muted-foreground">
                    Unit {selectedProperty.unitNumber} - {selectedProperty.projectName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedPaymentPlan.id}
                    onValueChange={(value) => {
                      const plan = paymentPlans.find((p) => p.id === value)
                      if (plan) setSelectedPaymentPlan(plan)
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select payment plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button onClick={handleDownloadPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <div className="print:p-0 print:m-0 print:shadow-none">
                <SalesOfferPreview property={selectedProperty} paymentPlan={selectedPaymentPlan} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
