"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ArrowUpDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Sample data - in a real app, this would come from an API
const properties = [
  {
    id: "PROP001",
    title: "Modern Apartment with Ocean View",
    type: "Apartment",
    location: "Miami Beach, FL",
    price: 450000,
    status: "Active",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    createdAt: "2023-01-15",
  },
  {
    id: "PROP002",
    title: "Luxury Villa with Pool",
    type: "House",
    location: "Beverly Hills, CA",
    price: 2500000,
    status: "Active",
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    createdAt: "2023-02-20",
  },
  {
    id: "PROP003",
    title: "Downtown Loft",
    type: "Apartment",
    location: "New York, NY",
    price: 3500,
    status: "Rented",
    bedrooms: 1,
    bathrooms: 1,
    area: 850,
    createdAt: "2023-03-05",
  },
  {
    id: "PROP004",
    title: "Waterfront Condo",
    type: "Condo",
    location: "Seattle, WA",
    price: 750000,
    status: "Pending",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    createdAt: "2023-03-10",
  },
  {
    id: "PROP005",
    title: "Mountain Cabin",
    type: "House",
    location: "Aspen, CO",
    price: 950000,
    status: "Active",
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    createdAt: "2023-04-01",
  },
]

export function PropertyTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof properties)[0]
    direction: "asc" | "desc"
  } | null>(null)

  // Filter properties based on search term
  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort properties based on sort config
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (!sortConfig) return 0

    const { key, direction } = sortConfig

    if (a[key] < b[key]) {
      return direction === "asc" ? -1 : 1
    }
    if (a[key] > b[key]) {
      return direction === "asc" ? 1 : -1
    }
    return 0
  })

  // Handle sort
  const handleSort = (key: keyof (typeof properties)[0]) => {
    let direction: "asc" | "desc" = "asc"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }

    setSortConfig({ key, direction })
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedProperties.length === sortedProperties.length) {
      setSelectedProperties([])
    } else {
      setSelectedProperties(sortedProperties.map((property) => property.id))
    }
  }

  // Handle select one
  const handleSelect = (id: string) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter((item) => item !== id))
    } else {
      setSelectedProperties([...selectedProperties, id])
    }
  }

  // Format price
  const formatPrice = (price: number, status: string) => {
    return status === "Rented" ? `$${price.toLocaleString()}/mo` : `$${price.toLocaleString()}`
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Pending":
        return "bg-yellow-500"
      case "Sold":
        return "bg-blue-500"
      case "Rented":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {selectedProperties.length > 0 && (
            <Button variant="outline" size="sm">
              Bulk Edit
            </Button>
          )}
          <Link href="/dashboard/properties/add">
            <Button size="sm">Add Property</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProperties.length === sortedProperties.length && sortedProperties.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all properties"
                />
              </TableHead>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("title")}>
                  Property
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("price")}>
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No properties found.
                </TableCell>
              </TableRow>
            ) : (
              sortedProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProperties.includes(property.id)}
                      onCheckedChange={() => handleSelect(property.id)}
                      aria-label={`Select ${property.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{property.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{property.title}</div>
                    <div className="text-sm text-muted-foreground">{property.location}</div>
                  </TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>{formatPrice(property.price, property.status)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(property.status)}>{property.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <span>{property.bedrooms} bd</span>
                      <span>•</span>
                      <span>{property.bathrooms} ba</span>
                      <span>•</span>
                      <span>{property.area} sqft</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit property</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Change status</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete property</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

