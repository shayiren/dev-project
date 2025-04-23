"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

const getStatusColor = (status: string, type: "bg" | "text") => {
  switch (status) {
    case "Available":
      return type === "bg" ? "bg-green-500" : "text-green-500"
    case "Sold":
      return type === "bg" ? "bg-red-500" : "text-red-500"
    case "Under Offer":
      return type === "bg" ? "bg-yellow-500" : "text-yellow-500"
    default:
      return type === "bg" ? "bg-gray-500" : "text-gray-500"
  }
}

export default function PriceManagementPage() {
  console.log("Price Management Page Loaded")
  const { toast } = useToast()
  const [properties, setProperties] = useState<any[]>([])
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [percentageIncrease, setPercentageIncrease] = useState("")
  const [newPricePerSqft, setNewPricePerSqft] = useState("")
  const [viewCategoryIncrement, setViewCategoryIncrement] = useState("")
  const [bedroomCountIncrement, setBedroomCountIncrement] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = () => {
    setIsLoading(true)
    try {
      const savedProperties = localStorage.getItem("properties")
      if (savedProperties) {
        const parsedProperties = JSON.parse(savedProperties)
        setProperties(parsedProperties)
      } else {
        setProperties([])
      }
    } catch (error) {
      console.error("Error loading properties:", error)
      setProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  const applyPercentageIncrease = () => {
    if (!percentageIncrease) {
      toast({
        title: "Error",
        description: "Please enter a percentage value",
        variant: "destructive",
      })
      return
    }

    const percentage = Number.parseFloat(percentageIncrease)
    if (isNaN(percentage)) {
      toast({
        title: "Error",
        description: "Invalid percentage value",
        variant: "destructive",
      })
      return
    }

    updatePrices((property) => {
      const increaseAmount = property.price * (percentage / 100)
      return property.price + increaseAmount
    })
  }

  const applyPricePerSqft = () => {
    if (!newPricePerSqft) {
      toast({
        title: "Error",
        description: "Please enter a price per sqft value",
        variant: "destructive",
      })
      return
    }

    const pricePerSqft = Number.parseFloat(newPricePerSqft)
    if (isNaN(pricePerSqft)) {
      toast({
        title: "Error",
        description: "Invalid price per sqft value",
        variant: "destructive",
      })
      return
    }

    updatePrices((property) => {
      return property.area * pricePerSqft
    })
  }

  const applyViewBasedIncrement = () => {
    if (!viewCategoryIncrement) {
      toast({
        title: "Error",
        description: "Please enter a view category increment value",
        variant: "destructive",
      })
      return
    }

    const increment = Number.parseFloat(viewCategoryIncrement)
    if (isNaN(increment)) {
      toast({
        title: "Error",
        description: "Invalid view category increment value",
        variant: "destructive",
      })
      return
    }

    updatePrices((property) => {
      // Check if the property has a sea view
      if (property.views && property.views.toLowerCase().includes("sea")) {
        return property.price + increment
      }
      return property.price
    })
  }

  const applyBedroomBasedUpdate = () => {
    if (!bedroomCountIncrement) {
      toast({
        title: "Error",
        description: "Please enter a bedroom count increment value",
        variant: "destructive",
      })
      return
    }

    const increment = Number.parseFloat(bedroomCountIncrement)
    if (isNaN(increment)) {
      toast({
        title: "Error",
        description: "Invalid bedroom count increment value",
        variant: "destructive",
      })
      return
    }

    updatePrices((property) => {
      // Check if the property has 2 bedrooms
      if (property.bedrooms === 2) {
        return property.price + increment
      }
      return property.price
    })
  }

  const applyBulkPriceDecrease = () => {
    if (!percentageIncrease) {
      toast({
        title: "Error",
        description: "Please enter a percentage value",
        variant: "destructive",
      })
      return
    }

    const percentage = Number.parseFloat(percentageIncrease)
    if (isNaN(percentage)) {
      toast({
        title: "Error",
        description: "Invalid percentage value",
        variant: "destructive",
      })
      return
    }

    updatePrices((property) => {
      const decreaseAmount = property.price * (percentage / 100)
      return property.price - decreaseAmount
    })
  }

  const updatePrices = (priceUpdateFn: (property: any) => number) => {
    try {
      // Get existing properties from localStorage
      const savedProperties = localStorage.getItem("properties")
      if (!savedProperties) return

      let updatedProperties = JSON.parse(savedProperties)

      // Update prices for selected properties
      updatedProperties = updatedProperties.map((property) => {
        if (selectedProperties.includes(property.id) && property.status === "Available") {
          const newPrice = priceUpdateFn(property)
          return { ...property, price: newPrice }
        }
        return property
      })

      // Save updated properties back to localStorage
      localStorage.setItem("properties", JSON.stringify(updatedProperties))

      // Update local state
      setProperties(updatedProperties)

      toast({
        title: "Prices updated",
        description: "Prices have been updated successfully",
      })
    } catch (error) {
      console.error("Error updating prices:", error)
      toast({
        title: "Error",
        description: "Failed to update prices",
        variant: "destructive",
      })
    }
  }

  const togglePropertySelection = (id: string) => {
    setSelectedProperties((prev) => (prev.includes(id) ? prev.filter((propId) => propId !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      setSelectedProperties([])
    } else {
      setSelectedProperties(properties.map((p) => p.id))
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight">Price Management</h1>
      <p className="text-muted-foreground">Adjust prices for available properties</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Percentage-Based Price Increase</CardTitle>
            <CardDescription>Increase prices of selected units by a percentage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="percentageIncrease">Percentage (+%)</Label>
              <Input
                id="percentageIncrease"
                type="number"
                placeholder="e.g., 5"
                value={percentageIncrease}
                onChange={(e) => setPercentageIncrease(e.target.value)}
              />
            </div>
            <Button onClick={applyPercentageIncrease}>Apply Increase</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price Adjustment per Sqft</CardTitle>
            <CardDescription>Modify total price based on updated price per square foot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPricePerSqft">New Price per Sqft</Label>
              <Input
                id="newPricePerSqft"
                type="number"
                placeholder="e.g., 2500"
                value={newPricePerSqft}
                onChange={(e) => setNewPricePerSqft(e.target.value)}
              />
            </div>
            <Button onClick={applyPricePerSqft}>Recalculate Price</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View-Based Price Increase</CardTitle>
            <CardDescription>Apply a price increment based on unit view types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="viewCategoryIncrement">Sea View Increment (AED)</Label>
              <Input
                id="viewCategoryIncrement"
                type="number"
                placeholder="e.g., 50000"
                value={viewCategoryIncrement}
                onChange={(e) => setViewCategoryIncrement(e.target.value)}
              />
            </div>
            <Button onClick={applyViewBasedIncrement}>Apply Increment</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bedroom-Based Price Update</CardTitle>
            <CardDescription>Adjust prices by bedroom count</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bedroomCountIncrement">2-Bed Unit Increment (AED)</Label>
              <Input
                id="bedroomCountIncrement"
                type="number"
                placeholder="e.g., 20000"
                value={bedroomCountIncrement}
                onChange={(e) => setBedroomCountIncrement(e.target.value)}
              />
            </div>
            <Button onClick={applyBedroomBasedUpdate}>Apply Update</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Price Decrease</CardTitle>
            <CardDescription>Select multiple units to apply a fixed or percentage decrease in price</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="percentageDecrease">Percentage (-%)</Label>
              <Input
                id="percentageDecrease"
                type="number"
                placeholder="e.g., 5"
                value={percentageIncrease}
                onChange={(e) => setPercentageIncrease(e.target.value)}
              />
            </div>
            <Button onClick={applyBulkPriceDecrease}>Apply Decrease</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Select Properties</CardTitle>
          <CardDescription>Select available properties to apply price adjustments</CardDescription>
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
                        checked={properties.length > 0 && selectedProperties.length === properties.length}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProperties.includes(property.id)}
                          onCheckedChange={() => togglePropertySelection(property.id)}
                          aria-label={`Select ${property.unitNumber}`}
                          disabled={property.status !== "Available"}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{property.unitNumber}</TableCell>
                      <TableCell>{property.projectName}</TableCell>
                      <TableCell>{property.type}</TableCell>
                      <TableCell>{property.price?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(property.status, "bg")}>
                          {property.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
