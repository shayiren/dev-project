"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getLocalStorage, setLocalStorage } from "@/utils/storage-utils"

interface Property {
  id: string
  name: string
  price: number
  sqft: number
  bedrooms: number
  view?: string
  selected?: boolean
}

export default function PriceManagementClient() {
  const [properties, setProperties] = useState<Property[]>([])
  const [percentage, setPercentage] = useState("")
  const [pricePerSqft, setPricePerSqft] = useState("")
  const [seaViewIncrement, setSeaViewIncrement] = useState("")
  const [bedroomIncrement, setBedroomIncrement] = useState("")
  const [bulkDecreaseAmount, setBulkDecreaseAmount] = useState("")
  const [bulkDecreaseType, setBulkDecreaseType] = useState<"fixed" | "percentage">("fixed")
  const { toast } = useToast()

  useEffect(() => {
    const loadedProperties = getLocalStorage("properties", [])
    setProperties(loadedProperties.map((prop: Property) => ({ ...prop, selected: false })))
  }, [])

  const saveProperties = (updatedProperties: Property[]) => {
    // Remove the selected property before saving
    const propsToSave = updatedProperties.map(({ selected, ...rest }) => rest)
    setLocalStorage("properties", propsToSave)
    setProperties(updatedProperties)

    toast({
      title: "Prices updated",
      description: "Property prices have been successfully updated.",
    })
  }

  const handlePercentageIncrease = () => {
    if (!percentage || isNaN(Number(percentage))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid percentage value.",
        variant: "destructive",
      })
      return
    }

    const percentValue = Number(percentage)
    const updatedProperties = properties.map((property) => ({
      ...property,
      price: property.price * (1 + percentValue / 100),
    }))

    saveProperties(updatedProperties)
  }

  const handlePricePerSqftUpdate = () => {
    if (!pricePerSqft || isNaN(Number(pricePerSqft))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid price per square foot.",
        variant: "destructive",
      })
      return
    }

    const pricePerSqftValue = Number(pricePerSqft)
    const updatedProperties = properties.map((property) => ({
      ...property,
      price: property.sqft * pricePerSqftValue,
    }))

    saveProperties(updatedProperties)
  }

  const handleViewBasedIncrease = () => {
    if (!seaViewIncrement || isNaN(Number(seaViewIncrement))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid increment amount.",
        variant: "destructive",
      })
      return
    }

    const incrementValue = Number(seaViewIncrement)
    const updatedProperties = properties.map((property) => ({
      ...property,
      price: property.view?.toLowerCase().includes("sea") ? property.price + incrementValue : property.price,
    }))

    saveProperties(updatedProperties)
  }

  const handleBedroomBasedUpdate = () => {
    if (!bedroomIncrement || isNaN(Number(bedroomIncrement))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid increment amount.",
        variant: "destructive",
      })
      return
    }

    const incrementValue = Number(bedroomIncrement)
    const updatedProperties = properties.map((property) => ({
      ...property,
      price: property.bedrooms === 2 ? property.price + incrementValue : property.price,
    }))

    saveProperties(updatedProperties)
  }

  const handleBulkDecrease = () => {
    if (!bulkDecreaseAmount || isNaN(Number(bulkDecreaseAmount))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    const decreaseValue = Number(bulkDecreaseAmount)
    const selectedProperties = properties.filter((p) => p.selected)

    if (selectedProperties.length === 0) {
      toast({
        title: "No properties selected",
        description: "Please select at least one property to apply the decrease.",
        variant: "destructive",
      })
      return
    }

    const updatedProperties = properties.map((property) => {
      if (!property.selected) return property

      return {
        ...property,
        price:
          bulkDecreaseType === "fixed" ? property.price - decreaseValue : property.price * (1 - decreaseValue / 100),
      }
    })

    saveProperties(updatedProperties)
  }

  const togglePropertySelection = (id: string) => {
    setProperties(
      properties.map((property) => (property.id === id ? { ...property, selected: !property.selected } : property)),
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Price Management</h1>
      <p className="text-muted-foreground mb-8">Adjust prices for available properties</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Percentage-Based Price Increase</CardTitle>
            <CardDescription>Increase prices of selected units by a percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="percentage">Percentage (+%)</Label>
                <Input
                  id="percentage"
                  placeholder="e.g., 5"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                />
              </div>
              <Button onClick={handlePercentageIncrease}>Apply Increase</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price Adjustment per Sqft</CardTitle>
            <CardDescription>Modify total price based on updated price per square foot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="pricePerSqft">New Price per Sqft</Label>
                <Input
                  id="pricePerSqft"
                  placeholder="e.g., 2500"
                  value={pricePerSqft}
                  onChange={(e) => setPricePerSqft(e.target.value)}
                />
              </div>
              <Button onClick={handlePricePerSqftUpdate}>Recalculate Price</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View-Based Price Increase</CardTitle>
            <CardDescription>Apply a price increment based on unit view types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="seaViewIncrement">Sea View Increment (AED)</Label>
                <Input
                  id="seaViewIncrement"
                  placeholder="e.g., 50000"
                  value={seaViewIncrement}
                  onChange={(e) => setSeaViewIncrement(e.target.value)}
                />
              </div>
              <Button onClick={handleViewBasedIncrease}>Apply Increment</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bedroom-Based Price Update</CardTitle>
            <CardDescription>Adjust prices by bedroom count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="bedroomIncrement">2-Bed Unit Increment (AED)</Label>
                <Input
                  id="bedroomIncrement"
                  placeholder="e.g., 20000"
                  value={bedroomIncrement}
                  onChange={(e) => setBedroomIncrement(e.target.value)}
                />
              </div>
              <Button onClick={handleBedroomBasedUpdate}>Apply Update</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Bulk Price Decrease</CardTitle>
          <CardDescription>Select multiple units to apply a fixed or percentage decrease</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fixed" className="mb-6">
            <TabsList>
              <TabsTrigger value="fixed" onClick={() => setBulkDecreaseType("fixed")}>
                Fixed Amount
              </TabsTrigger>
              <TabsTrigger value="percentage" onClick={() => setBulkDecreaseType("percentage")}>
                Percentage
              </TabsTrigger>
            </TabsList>
            <TabsContent value="fixed">
              <div className="flex flex-col space-y-4 mt-4">
                <div>
                  <Label htmlFor="fixedDecrease">Decrease Amount (AED)</Label>
                  <Input
                    id="fixedDecrease"
                    placeholder="e.g., 10000"
                    value={bulkDecreaseAmount}
                    onChange={(e) => setBulkDecreaseAmount(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="percentage">
              <div className="flex flex-col space-y-4 mt-4">
                <div>
                  <Label htmlFor="percentageDecrease">Decrease Percentage (%)</Label>
                  <Input
                    id="percentageDecrease"
                    placeholder="e.g., 5"
                    value={bulkDecreaseAmount}
                    onChange={(e) => setBulkDecreaseAmount(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="border rounded-md p-4 mb-4">
            <h3 className="font-medium mb-2">Select Properties</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {properties.map((property) => (
                <div key={property.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`property-${property.id}`}
                    checked={property.selected}
                    onCheckedChange={() => togglePropertySelection(property.id)}
                  />
                  <Label htmlFor={`property-${property.id}`} className="flex-1">
                    {property.name} - {property.bedrooms} BR - AED {property.price.toLocaleString()}
                  </Label>
                </div>
              ))}
              {properties.length === 0 && <p className="text-muted-foreground">No properties available</p>}
            </div>
          </div>

          <Button onClick={handleBulkDecrease}>Apply Decrease</Button>
        </CardContent>
      </Card>
    </div>
  )
}
