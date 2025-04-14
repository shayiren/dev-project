"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { format } from "date-fns"

// Define the SoldUnit type
type SoldUnit = {
  id: string
  unitNumber: string
  projectName: string
  buildingName: string
  bedrooms: number
  price: number
  clientInfo: {
    agencyName: string
    agentName: string
    clientName: string
    clientEmail?: string
    clientPhone?: string
  }
  bookingDate?: string
  soldDate: string
  floorPlan?: string
}

interface SoldUnitsTableProps {
  viewMode: "list" | "card"
  searchTerm: string
  formatPrice: (price: number) => string
}

export function SoldUnitsTable({ viewMode, searchTerm, formatPrice }: SoldUnitsTableProps) {
  const [soldUnits, setSoldUnits] = useState<SoldUnit[]>([])
  const [isFloorPlanDialogOpen, setIsFloorPlanDialogOpen] = useState(false)
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<string | null>(null)

  // Load sold units from localStorage on component mount
  useEffect(() => {
    try {
      // Get all properties from localStorage
      const savedProperties = localStorage.getItem("properties")
      if (savedProperties) {
        const allProperties = JSON.parse(savedProperties)

        // Filter out only the sold properties and transform them to SoldUnit type
        const soldProperties = allProperties
          .filter((property: any) => property.status === "Sold")
          .map((property: any) => ({
            id: property.id,
            unitNumber: property.unitNumber,
            projectName: property.projectName,
            buildingName: property.buildingName,
            bedrooms: property.bedrooms,
            price: property.price,
            clientInfo: property.clientInfo || {
              agencyName: "N/A",
              agentName: "N/A",
              clientName: "N/A",
            },
            bookingDate: property.bookingDate || "N/A",
            soldDate: property.soldDate || new Date().toISOString().split("T")[0], // Default to today if not available
            floorPlan: property.floorPlan,
          }))

        setSoldUnits(soldProperties)
      }
    } catch (error) {
      console.error("Error loading sold units:", error)
    }
  }, [])

  // Filter sold units based on search term
  const filteredSoldUnits = soldUnits.filter((unit) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      unit.unitNumber.toLowerCase().includes(searchLower) ||
      unit.projectName.toLowerCase().includes(searchLower) ||
      unit.buildingName.toLowerCase().includes(searchLower) ||
      unit.clientInfo.clientName.toLowerCase().includes(searchLower) ||
      unit.clientInfo.agencyName.toLowerCase().includes(searchLower)
    )
  })

  // Handle floor plan view
  const viewFloorPlan = (floorPlan: string) => {
    setSelectedFloorPlan(floorPlan)
    setIsFloorPlanDialogOpen(true)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (dateString === "N/A") return "N/A"
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (error) {
      return dateString
    }
  }

  return (
    <>
      {viewMode === "list" ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit No</TableHead>
                <TableHead className="hidden md:table-cell">Project</TableHead>
                <TableHead className="hidden md:table-cell">Building</TableHead>
                <TableHead className="hidden md:table-cell">Beds</TableHead>
                <TableHead>Sold Price</TableHead>
                <TableHead className="hidden md:table-cell">Client Name</TableHead>
                <TableHead className="hidden md:table-cell">Agency Name</TableHead>
                <TableHead className="hidden md:table-cell">Booking Date</TableHead>
                <TableHead className="hidden md:table-cell">Sold Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSoldUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    No sold units found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSoldUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                    <TableCell className="hidden md:table-cell">{unit.projectName}</TableCell>
                    <TableCell className="hidden md:table-cell">{unit.buildingName}</TableCell>
                    <TableCell className="hidden md:table-cell">{unit.bedrooms}</TableCell>
                    <TableCell>{formatPrice(unit.price)}</TableCell>
                    <TableCell className="hidden md:table-cell">{unit.clientInfo.clientName}</TableCell>
                    <TableCell className="hidden md:table-cell">{unit.clientInfo.agencyName}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(unit.bookingDate || "N/A")}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(unit.soldDate)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {unit.floorPlan && (
                            <DropdownMenuItem onClick={() => viewFloorPlan(unit.floorPlan || "")}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Floor Plan
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSoldUnits.length === 0 ? (
            <div className="col-span-full text-center py-4">No sold units found.</div>
          ) : (
            filteredSoldUnits.map((unit) => (
              <Card key={unit.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{unit.unitNumber}</CardTitle>
                      <CardDescription>
                        {unit.projectName} - {unit.buildingName}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                      Sold
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Bedrooms:</p>
                      <p>{unit.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sold Price:</p>
                      <p className="font-semibold">{formatPrice(unit.price)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Client:</p>
                      <p>{unit.clientInfo.clientName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Agency:</p>
                      <p>{unit.clientInfo.agencyName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Booking Date:</p>
                      <p>{formatDate(unit.bookingDate || "N/A")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sold Date:</p>
                      <p>{formatDate(unit.soldDate)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-2">
                  <div className="flex gap-1">
                    {unit.floorPlan && (
                      <Button variant="ghost" size="sm" onClick={() => viewFloorPlan(unit.floorPlan || "")}>
                        <Eye className="h-4 w-4 mr-1" /> Floor Plan
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-1" /> Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Floor Plan Dialog */}
      <Dialog open={isFloorPlanDialogOpen} onOpenChange={setIsFloorPlanDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Floor Plan</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedFloorPlan && (
              <Image
                src={selectedFloorPlan || "/placeholder.svg"}
                alt="Floor Plan"
                width={600}
                height={400}
                className="rounded-md"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
