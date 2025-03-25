"use client"

import { PropertyCard } from "@/components/property-card"

// This would typically come from an API or database
const featuredProperties = [
  {
    id: "prop1",
    title: "Modern Apartment with Ocean View",
    location: "Miami Beach, FL",
    price: 450000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    imageUrl: "/placeholder.svg?height=400&width=600",
    propertyType: "apartment",
    listingType: "sale",
    featured: true,
  },
  {
    id: "prop2",
    title: "Luxury Villa with Pool",
    location: "Beverly Hills, CA",
    price: 2500000,
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    imageUrl: "/placeholder.svg?height=400&width=600",
    propertyType: "house",
    listingType: "sale",
    featured: true,
  },
  {
    id: "prop3",
    title: "Downtown Loft",
    location: "New York, NY",
    price: 3500,
    bedrooms: 1,
    bathrooms: 1,
    area: 850,
    imageUrl: "/placeholder.svg?height=400&width=600",
    propertyType: "apartment",
    listingType: "rent",
    featured: true,
  },
  {
    id: "prop4",
    title: "Waterfront Condo",
    location: "Seattle, WA",
    price: 750000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    imageUrl: "/placeholder.svg?height=400&width=600",
    propertyType: "condo",
    listingType: "sale",
    featured: true,
  },
] as const

export function FeaturedProperties() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProperties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  )
}

