"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Conversion constants
const SQFT_TO_SQM = 0.092903
const SQM_TO_SQFT = 10.7639

export function AreaConverter() {
  const [activeTab, setActiveTab] = useState<"sqft" | "sqm">("sqft")
  const [sqft, setSqft] = useState<string>("0")
  const [sqm, setSqm] = useState<string>("0")

  // Convert when values change
  useEffect(() => {
    if (activeTab === "sqft" && sqft !== "") {
      const sqftValue = Number.parseFloat(sqft) || 0
      setSqm((sqftValue * SQFT_TO_SQM).toFixed(2))
    } else if (activeTab === "sqm" && sqm !== "") {
      const sqmValue = Number.parseFloat(sqm) || 0
      setSqft((sqmValue * SQM_TO_SQFT).toFixed(2))
    }
  }, [sqft, sqm, activeTab])

  const handleSqftChange = (value: string) => {
    setSqft(value)
    setActiveTab("sqft")
    if (value === "") {
      setSqm("")
    } else {
      const sqftValue = Number.parseFloat(value) || 0
      setSqm((sqftValue * SQFT_TO_SQM).toFixed(2))
    }
  }

  const handleSqmChange = (value: string) => {
    setSqm(value)
    setActiveTab("sqm")
    if (value === "") {
      setSqft("")
    } else {
      const sqmValue = Number.parseFloat(value) || 0
      setSqft((sqmValue * SQM_TO_SQFT).toFixed(2))
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Area Converter</CardTitle>
        <CardDescription>Convert between square feet and square meters</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sqft" value={activeTab} onValueChange={(value) => setActiveTab(value as "sqft" | "sqm")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sqft">Square Feet</TabsTrigger>
            <TabsTrigger value="sqm">Square Meters</TabsTrigger>
          </TabsList>
          <TabsContent value="sqft" className="mt-3">
            <div className="space-y-2">
              <Label htmlFor="sqft">Square Feet (SQFT)</Label>
              <Input
                id="sqft"
                type="number"
                value={sqft}
                onChange={(e) => handleSqftChange(e.target.value)}
                placeholder="Enter square feet"
              />
            </div>
          </TabsContent>
          <TabsContent value="sqm" className="mt-3">
            <div className="space-y-2">
              <Label htmlFor="sqm">Square Meters (SQM)</Label>
              <Input
                id="sqm"
                type="number"
                value={sqm}
                onChange={(e) => handleSqmChange(e.target.value)}
                placeholder="Enter square meters"
              />
            </div>
          </TabsContent>
          <div className="mt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Result:</span>
              <span className="font-medium">{activeTab === "sqft" ? `${sqm} SQM` : `${sqft} SQFT`}</span>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
