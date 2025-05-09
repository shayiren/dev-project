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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Property {
  id: string
  name: string
  price: number
  sqft: number
  bedrooms: number
  view?: string
  selected?: boolean
  unitNumber: string
  totalArea: number
  status?: string
}

export default function PriceManagementClient() {
  const [properties, setProperties] = useState<Property[]>([])
  const [percentage, setPercentage] = useState("")
  const [pricePerSqft, setPricePerSqft] = useState("")
  const [seaViewIncrement, setSeaViewIncrement] = useState("")
  const [bedroomIncrement, setBedroomIncrement] = useState("")
  const [selectedBedroom, setSelectedBedroom] = useState<string>("1")
  const [bulkDecreaseAmount, setBulkDecreaseAmount] = useState("")
  const [bulkDecreaseType, setBulkDecreaseType] = useState<"fixed" | "percentage">("fixed")
  const { toast } = useToast()

  // Unit-specific states
  const [selectedUnit, setSelectedUnit] = useState<string>("")
  const [unitFilter, setUnitFilter] = useState<string>("")
  const [unitPriceIncrease, setUnitPriceIncrease] = useState("")
  const [unitPercentageIncrease, setUnitPercentageIncrease] = useState("")
  const [newPricePerSqft, setNewPricePerSqft] = useState("")
  const [unitIncreaseType, setUnitIncreaseType] = useState<"fixed" | "percentage" | "sqft">("fixed")
  const [calculatedPercentage, setCalculatedPercentage] = useState<number | null>(null)
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)
  const [calculatedPricePerSqft, setCalculatedPricePerSqft] = useState<number | null>(null)

  // Series-based states
  const [seriesType, setSeriesType] = useState<"startsWith" | "endsWith">("startsWith")
  const [seriesValue, setSeriesValue] = useState<string>("")
  const [seriesIncreaseAmount, setSeriesIncreaseAmount] = useState<string>("")
  const [seriesIncreaseType, setSeriesIncreaseType] = useState<"fixed" | "percentage" | "sqft">("fixed")
  const [seriesPreview, setSeriesPreview] = useState<{ [key: string]: number }>({})

  // Preview states for each section
  const [percentagePreview, setPercentagePreview] = useState<{ [key: string]: number }>({})
  const [pricePerSqftPreview, setPricePerSqftPreview] = useState<{ [key: string]: number }>({})
  const [viewBasedPreview, setViewBasedPreview] = useState<{ [key: string]: number }>({})
  const [bedroomBasedPreview, setBedroomBasedPreview] = useState<{ [key: string]: number }>({})
  const [bulkDecreasePreview, setBulkDecreasePreview] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const loadedProperties = getLocalStorage("properties", [])
    setProperties(loadedProperties.map((prop: Property) => ({ ...prop, selected: false })))
  }, [])

  const saveProperties = (updatedProperties: Property[]) => {
    // Remove the selected property before saving
    const propsToSave = updatedProperties.map(({ selected, ...rest }) => rest)
    setLocalStorage("properties", propsToSave)
    setProperties(updatedProperties)

    // Clear all previews
    setPercentagePreview({})
    setPricePerSqftPreview({})
    setViewBasedPreview({})
    setBedroomBasedPreview({})
    setBulkDecreasePreview({})
    setSeriesPreview({})

    toast({
      title: "Prices updated",
      description: "Property prices have been successfully updated.",
    })
  }

  // Filter units based on the input
  const filteredUnits = properties
    .filter((p) => p.status !== "Sold" && p.unitNumber.toLowerCase().includes(unitFilter.toLowerCase()))
    .sort((a, b) => a.unitNumber.localeCompare(b.unitNumber))

  const calculatePercentagePreview = () => {
    if (!percentage || isNaN(Number(percentage))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid percentage value.",
        variant: "destructive",
      })
      return
    }

    const percentValue = Number(percentage)
    const preview: { [key: string]: number } = {}

    properties.forEach((property) => {
      preview[property.id] = property.price * (1 + percentValue / 100)
    })

    setPercentagePreview(preview)
  }

  const handlePercentageIncrease = () => {
    if (Object.keys(percentagePreview).length === 0) {
      calculatePercentagePreview()
      return
    }

    const updatedProperties = properties.map((property) => ({
      ...property,
      price: percentagePreview[property.id] || property.price,
    }))

    saveProperties(updatedProperties)
  }

  const calculatePricePerSqftPreview = () => {
    if (!pricePerSqft || isNaN(Number(pricePerSqft))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid price per square foot.",
        variant: "destructive",
      })
      return
    }

    const pricePerSqftValue = Number(pricePerSqft)
    const preview: { [key: string]: number } = {}

    properties.forEach((property) => {
      preview[property.id] = property.totalArea * pricePerSqftValue
    })

    setPricePerSqftPreview(preview)
  }

  const handlePricePerSqftUpdate = () => {
    if (Object.keys(pricePerSqftPreview).length === 0) {
      calculatePricePerSqftPreview()
      return
    }

    const updatedProperties = properties.map((property) => ({
      ...property,
      price: pricePerSqftPreview[property.id] || property.price,
    }))

    saveProperties(updatedProperties)
  }

  const calculateViewBasedPreview = () => {
    if (!seaViewIncrement || isNaN(Number(seaViewIncrement))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid increment amount.",
        variant: "destructive",
      })
      return
    }

    const incrementValue = Number(seaViewIncrement)
    const preview: { [key: string]: number } = {}

    properties.forEach((property) => {
      preview[property.id] = property.view?.toLowerCase().includes("sea")
        ? property.price + incrementValue
        : property.price
    })

    setViewBasedPreview(preview)
  }

  const handleViewBasedIncrease = () => {
    if (Object.keys(viewBasedPreview).length === 0) {
      calculateViewBasedPreview()
      return
    }

    const updatedProperties = properties.map((property) => ({
      ...property,
      price: viewBasedPreview[property.id] || property.price,
    }))

    saveProperties(updatedProperties)
  }

  const calculateBedroomBasedPreview = () => {
    if (!bedroomIncrement || isNaN(Number(bedroomIncrement))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid increment amount.",
        variant: "destructive",
      })
      return
    }

    const incrementValue = Number(bedroomIncrement)
    const selectedBedroomCount = Number(selectedBedroom)
    const preview: { [key: string]: number } = {}

    properties.forEach((property) => {
      preview[property.id] =
        property.bedrooms === selectedBedroomCount ? property.price + incrementValue : property.price
    })

    setBedroomBasedPreview(preview)
  }

  const handleBedroomBasedUpdate = () => {
    if (Object.keys(bedroomBasedPreview).length === 0) {
      calculateBedroomBasedPreview()
      return
    }

    const updatedProperties = properties.map((property) => ({
      ...property,
      price: bedroomBasedPreview[property.id] || property.price,
    }))

    saveProperties(updatedProperties)
  }

  const calculateBulkDecreasePreview = () => {
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

    const preview: { [key: string]: number } = {}

    properties.forEach((property) => {
      if (property.selected) {
        preview[property.id] =
          bulkDecreaseType === "fixed" ? property.price - decreaseValue : property.price * (1 - decreaseValue / 100)
      }
    })

    setBulkDecreasePreview(preview)
  }

  const handleBulkDecrease = () => {
    if (Object.keys(bulkDecreasePreview).length === 0) {
      calculateBulkDecreasePreview()
      return
    }

    const updatedProperties = properties.map((property) => ({
      ...property,
      price: bulkDecreasePreview[property.id] || property.price,
    }))

    saveProperties(updatedProperties)
  }

  const togglePropertySelection = (id: string) => {
    setProperties(
      properties.map((property) => (property.id === id ? { ...property, selected: !property.selected } : property)),
    )
    // Clear bulk decrease preview when selection changes
    setBulkDecreasePreview({})
  }

  const handleUnitPriceAdjustment = () => {
    if (!selectedUnit) {
      toast({
        title: "No unit selected",
        description: "Please select a unit to adjust its price.",
        variant: "destructive",
      })
      return
    }

    const selectedProperty = properties.find((p) => p.unitNumber === selectedUnit)
    if (!selectedProperty) {
      toast({
        title: "Unit not found",
        description: `Could not find unit ${selectedUnit}.`,
        variant: "destructive",
      })
      return
    }

    let newPrice = selectedProperty.price
    let percentageChange = 0

    if (unitIncreaseType === "fixed") {
      if (!unitPriceIncrease || isNaN(Number(unitPriceIncrease))) {
        toast({
          title: "Invalid input",
          description: "Please enter a valid price increase amount.",
          variant: "destructive",
        })
        return
      }

      const increaseAmount = Number(unitPriceIncrease)
      newPrice = selectedProperty.price + increaseAmount
      percentageChange = (increaseAmount / selectedProperty.price) * 100
    } else if (unitIncreaseType === "percentage") {
      if (!unitPercentageIncrease || isNaN(Number(unitPercentageIncrease))) {
        toast({
          title: "Invalid input",
          description: "Please enter a valid percentage value.",
          variant: "destructive",
        })
        return
      }

      const percentValue = Number(unitPercentageIncrease)
      newPrice = selectedProperty.price * (1 + percentValue / 100)
      percentageChange = percentValue
    } else if (unitIncreaseType === "sqft") {
      if (!newPricePerSqft || isNaN(Number(newPricePerSqft))) {
        toast({
          title: "Invalid input",
          description: "Please enter a valid price per square foot.",
          variant: "destructive",
        })
        return
      }

      const pricePerSqftValue = Number(newPricePerSqft)
      const oldPrice = selectedProperty.price
      newPrice = selectedProperty.totalArea * pricePerSqftValue
      percentageChange = ((newPrice - oldPrice) / oldPrice) * 100
    }

    const updatedProperties = properties.map((property) =>
      property.unitNumber === selectedUnit ? { ...property, price: newPrice } : property,
    )

    saveProperties(updatedProperties)

    // Update calculated values for display
    setCalculatedPercentage(percentageChange)
    setCalculatedPrice(newPrice)
    setCalculatedPricePerSqft(newPrice / selectedProperty.totalArea)

    toast({
      title: "Price updated",
      description: `Unit ${selectedUnit} price has been updated to ${newPrice.toLocaleString()}.`,
    })
  }

  const handleUnitSelection = (unitNumber: string) => {
    setSelectedUnit(unitNumber)

    // Reset calculated values
    setCalculatedPercentage(null)
    setCalculatedPrice(null)
    setCalculatedPricePerSqft(null)

    // Find the selected property
    const selectedProperty = properties.find((p) => p.unitNumber === unitNumber)
    if (selectedProperty) {
      // Pre-calculate price per sqft for reference
      const currentPricePerSqft = selectedProperty.price / selectedProperty.totalArea
      setCalculatedPricePerSqft(currentPricePerSqft)
    }
  }

  const calculateSeriesPreview = () => {
    if (!seriesValue) {
      toast({
        title: "Missing series value",
        description: "Please enter a series value (e.g., '05' for 05 series).",
        variant: "destructive",
      })
      return
    }

    if (!seriesIncreaseAmount || isNaN(Number(seriesIncreaseAmount))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    const preview: { [key: string]: number } = {}
    const amount = Number(seriesIncreaseAmount)

    properties.forEach((property) => {
      const unitNumber = property.unitNumber
      const matchesSeries =
        seriesType === "startsWith" ? unitNumber.startsWith(seriesValue) : unitNumber.endsWith(seriesValue)

      if (matchesSeries) {
        if (seriesIncreaseType === "fixed") {
          preview[property.id] = property.price + amount
        } else if (seriesIncreaseType === "percentage") {
          preview[property.id] = property.price * (1 + amount / 100)
        } else if (seriesIncreaseType === "sqft") {
          preview[property.id] = property.totalArea * amount
        }
      }
    })

    if (Object.keys(preview).length === 0) {
      toast({
        title: "No matching units",
        description: `No units found that ${seriesType === "startsWith" ? "start with" : "end with"} '${seriesValue}'.`,
        variant: "destructive",
      })
      return
    }

    setSeriesPreview(preview)
  }

  const handleSeriesUpdate = () => {
    if (Object.keys(seriesPreview).length === 0) {
      calculateSeriesPreview()
      return
    }

    const updatedProperties = properties.map((property) => ({
      ...property,
      price: seriesPreview[property.id] || property.price,
    }))

    saveProperties(updatedProperties)
    setSeriesPreview({})

    toast({
      title: "Prices updated",
      description: `Updated prices for ${Object.keys(seriesPreview).length} units in the ${seriesValue} series.`,
    })
  }

  // Get unique bedroom counts
  const uniqueBedrooms = Array.from(new Set(properties.map((p) => p.bedrooms))).sort()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Price Management</h1>
      <p className="text-muted-foreground mb-8">Adjust prices for available properties</p>

      <div className="grid grid-cols-1 gap-6">
        {/* First row - Unit-Specific and Series-Based side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unit-Specific Price Adjustment */}
          <Card>
            <CardHeader>
              <CardTitle>Unit-Specific Price Adjustment</CardTitle>
              <CardDescription>Adjust price for a specific unit by unit number</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unitSelect">Select or Type Unit Number</Label>
                  <div className="relative">
                    <Input
                      id="unitFilter"
                      placeholder="Type to filter units..."
                      value={unitFilter}
                      onChange={(e) => setUnitFilter(e.target.value)}
                      className="mb-1"
                    />
                    <Select value={selectedUnit} onValueChange={handleUnitSelection}>
                      <SelectTrigger id="unitSelect" className="w-full">
                        <SelectValue placeholder="Select a unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredUnits.map((property) => (
                          <SelectItem key={property.id} value={property.unitNumber}>
                            Unit {property.unitNumber} - {property.bedrooms} BR - AED {property.price.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Tabs defaultValue="fixed" className="mb-4">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="fixed" onClick={() => setUnitIncreaseType("fixed")}>
                      Fixed Amount
                    </TabsTrigger>
                    <TabsTrigger value="percentage" onClick={() => setUnitIncreaseType("percentage")}>
                      Percentage
                    </TabsTrigger>
                    <TabsTrigger value="sqft" onClick={() => setUnitIncreaseType("sqft")}>
                      Price per Sqft
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="fixed">
                    <div className="mt-2">
                      <Label htmlFor="unitPriceIncrease">Increase Amount (AED)</Label>
                      <Input
                        id="unitPriceIncrease"
                        placeholder="e.g., 80000"
                        value={unitPriceIncrease}
                        onChange={(e) => setUnitPriceIncrease(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="percentage">
                    <div className="mt-2">
                      <Label htmlFor="unitPercentageIncrease">Increase Percentage (%)</Label>
                      <Input
                        id="unitPercentageIncrease"
                        placeholder="e.g., 5"
                        value={unitPercentageIncrease}
                        onChange={(e) => setUnitPercentageIncrease(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="sqft">
                    <div className="mt-2">
                      <Label htmlFor="newPricePerSqft">New Price per Sqft (AED)</Label>
                      <Input
                        id="newPricePerSqft"
                        placeholder="e.g., 2500"
                        value={newPricePerSqft}
                        onChange={(e) => setNewPricePerSqft(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {selectedUnit && (
                  <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
                    <p>
                      <strong>Old Price:</strong> AED{" "}
                      {properties.find((p) => p.unitNumber === selectedUnit)?.price.toLocaleString() || "N/A"}
                    </p>

                    {calculatedPrice !== null && (
                      <p>
                        <strong>New Price:</strong> AED {calculatedPrice.toLocaleString()}
                      </p>
                    )}

                    {calculatedPercentage !== null && (
                      <p>
                        <strong>Price Change:</strong> {calculatedPercentage.toFixed(2)}%
                      </p>
                    )}

                    <p>
                      <strong>Current Price/Sqft:</strong> AED{" "}
                      {(
                        (properties.find((p) => p.unitNumber === selectedUnit)?.price || 0) /
                        (properties.find((p) => p.unitNumber === selectedUnit)?.totalArea || 1)
                      ).toFixed(2) || "N/A"}
                    </p>

                    {calculatedPricePerSqft !== null && (
                      <p>
                        <strong>New Price/Sqft:</strong> AED {calculatedPricePerSqft.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}

                <Button onClick={handleUnitPriceAdjustment} disabled={!selectedUnit} className="w-full">
                  Apply Price Change
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Series-Based Price Adjustment */}
          <Card>
            <CardHeader>
              <CardTitle>Series-Based Price Adjustment</CardTitle>
              <CardDescription>Adjust prices for units in a specific series or pattern</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Series Type</Label>
                  <RadioGroup
                    defaultValue="startsWith"
                    value={seriesType}
                    onValueChange={(value) => setSeriesType(value as "startsWith" | "endsWith")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="startsWith" id="startsWith" />
                      <Label htmlFor="startsWith">Starts With</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="endsWith" id="endsWith" />
                      <Label htmlFor="endsWith">Ends With</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="seriesValue">Series Value</Label>
                  <Input
                    id="seriesValue"
                    placeholder={seriesType === "startsWith" ? "e.g., 2 for 2xx units" : "e.g., 05 for xx05 units"}
                    value={seriesValue}
                    onChange={(e) => {
                      setSeriesValue(e.target.value)
                      setSeriesPreview({})
                    }}
                  />
                </div>

                <Tabs defaultValue="fixed" className="mb-4">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="fixed" onClick={() => setSeriesIncreaseType("fixed")}>
                      Fixed Amount
                    </TabsTrigger>
                    <TabsTrigger value="percentage" onClick={() => setSeriesIncreaseType("percentage")}>
                      Percentage
                    </TabsTrigger>
                    <TabsTrigger value="sqft" onClick={() => setSeriesIncreaseType("sqft")}>
                      Price per Sqft
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="fixed">
                    <div className="mt-2">
                      <Label htmlFor="seriesFixedAmount">Increase Amount (AED)</Label>
                      <Input
                        id="seriesFixedAmount"
                        placeholder="e.g., 50000"
                        value={seriesIncreaseAmount}
                        onChange={(e) => {
                          setSeriesIncreaseAmount(e.target.value)
                          setSeriesPreview({})
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="percentage">
                    <div className="mt-2">
                      <Label htmlFor="seriesPercentage">Increase Percentage (%)</Label>
                      <Input
                        id="seriesPercentage"
                        placeholder="e.g., 5"
                        value={seriesIncreaseAmount}
                        onChange={(e) => {
                          setSeriesIncreaseAmount(e.target.value)
                          setSeriesPreview({})
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="sqft">
                    <div className="mt-2">
                      <Label htmlFor="seriesPricePerSqft">New Price per Sqft (AED)</Label>
                      <Input
                        id="seriesPricePerSqft"
                        placeholder="e.g., 2500"
                        value={seriesIncreaseAmount}
                        onChange={(e) => {
                          setSeriesIncreaseAmount(e.target.value)
                          setSeriesPreview({})
                        }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {Object.keys(seriesPreview).length > 0 && (
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p className="font-medium mb-1">
                      Preview of changes for units {seriesType === "startsWith" ? "starting with" : "ending with"} '
                      {seriesValue}':
                    </p>
                    <div className="max-h-24 overflow-y-auto space-y-1 mb-1">
                      {properties
                        .filter((p) => seriesPreview[p.id])
                        .slice(0, 3)
                        .map((property) => (
                          <div key={property.id} className="flex justify-between text-sm">
                            <span>Unit {property.unitNumber}:</span>
                            <div>
                              <span className="line-through mr-2">AED {property.price.toLocaleString()}</span>
                              <Badge variant="outline" className="bg-green-50">
                                AED {seriesPreview[property.id]?.toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      {Object.keys(seriesPreview).length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          + {Object.keys(seriesPreview).length - 3} more units
                        </p>
                      )}
                    </div>
                    <p className="text-sm">
                      <strong>Total units affected:</strong> {Object.keys(seriesPreview).length}
                    </p>
                  </div>
                )}

                <Button onClick={handleSeriesUpdate} className="w-full">
                  {Object.keys(seriesPreview).length === 0 ? "Preview Changes" : "Apply Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second row - Other price adjustment options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Percentage-Based Price Increase</CardTitle>
              <CardDescription>Increase prices of all units by a percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div>
                  <Label htmlFor="percentage">Percentage (+%)</Label>
                  <Input
                    id="percentage"
                    placeholder="e.g., 5"
                    value={percentage}
                    onChange={(e) => {
                      setPercentage(e.target.value)
                      setPercentagePreview({})
                    }}
                  />
                </div>
                <Button onClick={handlePercentageIncrease}>
                  {Object.keys(percentagePreview).length === 0 ? "Preview Changes" : "Apply Increase"}
                </Button>

                {Object.keys(percentagePreview).length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="font-medium mb-2">Preview of changes:</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {properties.slice(0, 5).map((property) => (
                        <div key={property.id} className="flex justify-between text-sm">
                          <span>Unit {property.unitNumber}:</span>
                          <div>
                            <span className="line-through mr-2">AED {property.price.toLocaleString()}</span>
                            <Badge variant="outline" className="bg-green-50">
                              AED {percentagePreview[property.id]?.toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {properties.length > 5 && (
                        <p className="text-xs text-muted-foreground">+ {properties.length - 5} more units</p>
                      )}
                    </div>
                  </div>
                )}
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
                    onChange={(e) => {
                      setPricePerSqft(e.target.value)
                      setPricePerSqftPreview({})
                    }}
                  />
                </div>
                <Button onClick={handlePricePerSqftUpdate}>
                  {Object.keys(pricePerSqftPreview).length === 0 ? "Preview Changes" : "Recalculate Price"}
                </Button>

                {Object.keys(pricePerSqftPreview).length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="font-medium mb-2">Preview of changes:</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {properties.slice(0, 5).map((property) => (
                        <div key={property.id} className="flex justify-between text-sm">
                          <span>Unit {property.unitNumber}:</span>
                          <div>
                            <span className="line-through mr-2">AED {property.price.toLocaleString()}</span>
                            <Badge variant="outline" className="bg-green-50">
                              AED {pricePerSqftPreview[property.id]?.toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {properties.length > 5 && (
                        <p className="text-xs text-muted-foreground">+ {properties.length - 5} more units</p>
                      )}
                    </div>
                  </div>
                )}
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
                    onChange={(e) => {
                      setSeaViewIncrement(e.target.value)
                      setViewBasedPreview({})
                    }}
                  />
                </div>
                <Button onClick={handleViewBasedIncrease}>
                  {Object.keys(viewBasedPreview).length === 0 ? "Preview Changes" : "Apply Increment"}
                </Button>

                {Object.keys(viewBasedPreview).length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="font-medium mb-2">Preview of changes:</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {properties
                        .filter((p) => p.view?.toLowerCase().includes("sea"))
                        .slice(0, 5)
                        .map((property) => (
                          <div key={property.id} className="flex justify-between text-sm">
                            <span>Unit {property.unitNumber}:</span>
                            <div>
                              <span className="line-through mr-2">AED {property.price.toLocaleString()}</span>
                              <Badge variant="outline" className="bg-green-50">
                                AED {viewBasedPreview[property.id]?.toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      {properties.filter((p) => p.view?.toLowerCase().includes("sea")).length > 5 && (
                        <p className="text-xs text-muted-foreground">
                          + {properties.filter((p) => p.view?.toLowerCase().includes("sea")).length - 5} more units
                        </p>
                      )}
                    </div>
                  </div>
                )}
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
                <div className="space-y-2">
                  <Label htmlFor="bedroomSelect">Select Bedroom Count</Label>
                  <Select value={selectedBedroom} onValueChange={setSelectedBedroom}>
                    <SelectTrigger id="bedroomSelect">
                      <SelectValue placeholder="Select bedroom count" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueBedrooms.map((bedroom) => (
                        <SelectItem key={bedroom} value={bedroom.toString()}>
                          {bedroom} Bedroom
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bedroomIncrement">Price Increment (AED)</Label>
                  <Input
                    id="bedroomIncrement"
                    placeholder="e.g., 20000"
                    value={bedroomIncrement}
                    onChange={(e) => {
                      setBedroomIncrement(e.target.value)
                      setBedroomBasedPreview({})
                    }}
                  />
                </div>
                <Button onClick={handleBedroomBasedUpdate}>
                  {Object.keys(bedroomBasedPreview).length === 0 ? "Preview Changes" : "Apply Update"}
                </Button>

                {Object.keys(bedroomBasedPreview).length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="font-medium mb-2">Preview of changes:</p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {properties
                        .filter((p) => p.bedrooms === Number(selectedBedroom))
                        .slice(0, 5)
                        .map((property) => (
                          <div key={property.id} className="flex justify-between text-sm">
                            <span>Unit {property.unitNumber}:</span>
                            <div>
                              <span className="line-through mr-2">AED {property.price.toLocaleString()}</span>
                              <Badge variant="outline" className="bg-green-50">
                                AED {bedroomBasedPreview[property.id]?.toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      {properties.filter((p) => p.bedrooms === Number(selectedBedroom)).length > 5 && (
                        <p className="text-xs text-muted-foreground">
                          + {properties.filter((p) => p.bedrooms === Number(selectedBedroom)).length - 5} more units
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
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
                      onChange={(e) => {
                        setBulkDecreaseAmount(e.target.value)
                        setBulkDecreasePreview({})
                      }}
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
                      onChange={(e) => {
                        setBulkDecreaseAmount(e.target.value)
                        setBulkDecreasePreview({})
                      }}
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
                      {property.unitNumber} - {property.bedrooms} BR - AED {property.price.toLocaleString()}
                      {bulkDecreasePreview[property.id] && (
                        <Badge variant="outline" className="ml-2 bg-red-50">
                          → AED {bulkDecreasePreview[property.id].toLocaleString()}
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
                {properties.length === 0 && <p className="text-muted-foreground">No properties available</p>}
              </div>
            </div>

            <Button onClick={handleBulkDecrease}>
              {Object.keys(bulkDecreasePreview).length === 0 ? "Preview Changes" : "Apply Decrease"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
