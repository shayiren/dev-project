import { NextResponse } from "next/server"

// This would typically come from a database
const properties = [
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
    description: "Stunning apartment with panoramic ocean views, modern finishes, and resort-style amenities.",
    amenities: ["Pool", "Gym", "Concierge", "Parking", "Security"],
    yearBuilt: 2018,
    status: "Active",
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
    description:
      "Magnificent villa in the heart of Beverly Hills with a private pool, home theater, and gourmet kitchen.",
    amenities: ["Pool", "Home Theater", "Wine Cellar", "Garden", "Smart Home"],
    yearBuilt: 2015,
    status: "Active",
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
    description: "Stylish loft in downtown Manhattan with exposed brick walls, high ceilings, and modern amenities.",
    amenities: ["Doorman", "Elevator", "Laundry", "Roof Deck", "Bike Storage"],
    yearBuilt: 2005,
    status: "Active",
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
    description:
      "Beautiful waterfront condo with stunning views of Puget Sound, modern finishes, and building amenities.",
    amenities: ["Pool", "Gym", "Waterfront", "Balcony", "Parking"],
    yearBuilt: 2010,
    status: "Active",
  },
  {
    id: "prop5",
    title: "Mountain Cabin",
    location: "Aspen, CO",
    price: 950000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    imageUrl: "/placeholder.svg?height=400&width=600",
    propertyType: "house",
    listingType: "sale",
    featured: false,
    description: "Charming mountain cabin with breathtaking views, stone fireplace, and outdoor hot tub.",
    amenities: ["Fireplace", "Hot Tub", "Deck", "Mountain View", "Ski Storage"],
    yearBuilt: 2008,
    status: "Active",
  },
  {
    id: "prop6",
    title: "Beachfront Bungalow",
    location: "Malibu, CA",
    price: 1800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    imageUrl: "/placeholder.svg?height=400&width=600",
    propertyType: "house",
    listingType: "sale",
    featured: false,
    description: "Charming beachfront bungalow with direct beach access, open floor plan, and stunning sunset views.",
    amenities: ["Beachfront", "Deck", "Outdoor Shower", "Fireplace", "Parking"],
    yearBuilt: 1995,
    status: "Active",
  },
  {
    id: "prop7",
    title: "Modern Townhouse",
    location: "Chicago, IL",
    price: 550000,
    bedrooms: 3,
    bathrooms: 2.5,
    area: 2000,
    imageUrl: "/placeholder.svg?height=400&width=600",
    propertyType: "townhouse",
    listingType: "sale",
    featured: false,
    description: "Contemporary townhouse in a prime location with rooftop terrace, garage, and modern finishes.",
    amenities: ["Garage", "Rooftop Terrace", "Fireplace", "Smart Home", "Storage"],
    yearBuilt: 2019,
    status: "Active",
  },
  {
    id: "prop8",
    title: "Luxury Penthouse",
    location: "Miami, FL",
    price: 8000,
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2800,
    imageUrl: "/placeholder.svg?height=400&width=600",
    propertyType: "apartment",
    listingType: "rent",
    featured: false,
    description: "Spectacular penthouse with panoramic city and ocean views, private terrace, and luxury finishes.",
    amenities: ["Pool", "Gym", "Concierge", "Valet", "Private Terrace"],
    yearBuilt: 2017,
    status: "Active",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Parse query parameters
  const type = searchParams.get("type")
  const location = searchParams.get("location")
  const propertyType = searchParams.get("propertyType")
  const priceRange = searchParams.get("priceRange")
  const featured = searchParams.get("featured")

  // Filter properties based on query parameters
  let filteredProperties = [...properties]

  if (type === "buy") {
    filteredProperties = filteredProperties.filter((p) => p.listingType === "sale")
  } else if (type === "rent") {
    filteredProperties = filteredProperties.filter((p) => p.listingType === "rent")
  }

  if (location) {
    filteredProperties = filteredProperties.filter((p) => p.location.toLowerCase().includes(location.toLowerCase()))
  }

  if (propertyType) {
    filteredProperties = filteredProperties.filter((p) => p.propertyType === propertyType)
  }

  if (priceRange) {
    const [min, max] = priceRange.split("-").map(Number)
    if (min && max) {
      filteredProperties = filteredProperties.filter((p) => p.price >= min && p.price <= max)
    } else if (min && priceRange.includes("+")) {
      filteredProperties = filteredProperties.filter((p) => p.price >= min)
    }
  }

  if (featured === "true") {
    filteredProperties = filteredProperties.filter((p) => p.featured)
  }

  return NextResponse.json(filteredProperties)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.location || !body.price || !body.propertyType || !body.listingType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would save to a database here
    // For this example, we'll just return the created property with a fake ID
    const newProperty = {
      id: `prop${Date.now()}`,
      ...body,
      featured: body.featured || false,
      imageUrl: body.imageUrl || "/placeholder.svg?height=400&width=600",
      status: "Active",
    }

    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}

