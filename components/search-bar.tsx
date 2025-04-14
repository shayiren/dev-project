"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SearchBar() {
  const router = useRouter()
  const [searchType, setSearchType] = useState<"buy" | "rent">("buy")
  const [location, setLocation] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [priceRange, setPriceRange] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    params.append("type", searchType)
    if (location) params.append("location", location)
    if (propertyType) params.append("propertyType", propertyType)
    if (priceRange) params.append("priceRange", priceRange)

    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-4xl mx-auto">
      <Tabs defaultValue="buy" onValueChange={(value) => setSearchType(value as "buy" | "rent")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="rent">Rent</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="mt-0">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="w-full md:w-48">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100000">$0 - $100,000</SelectItem>
                  <SelectItem value="100000-250000">$100,000 - $250,000</SelectItem>
                  <SelectItem value="250000-500000">$250,000 - $500,000</SelectItem>
                  <SelectItem value="500000-750000">$500,000 - $750,000</SelectItem>
                  <SelectItem value="750000-1000000">$750,000 - $1,000,000</SelectItem>
                  <SelectItem value="1000000+">$1,000,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="md:w-auto">
              Search
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="rent" className="mt-0">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="w-full md:w-48">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1000">$0 - $1,000/mo</SelectItem>
                  <SelectItem value="1000-2000">$1,000 - $2,000/mo</SelectItem>
                  <SelectItem value="2000-3000">$2,000 - $3,000/mo</SelectItem>
                  <SelectItem value="3000-5000">$3,000 - $5,000/mo</SelectItem>
                  <SelectItem value="5000+">$5,000+/mo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="md:w-auto">
              Search
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
