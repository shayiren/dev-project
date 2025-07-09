import { NextResponse } from "next/server"

// Mock data based on the CSV
const properties = [
  {
    id: "imp-001",
    unitNumber: "DM-101",
    title: "Marina View Apartment 1",
    projectName: "Dubai Marina Towers",
    developerName: "Prime Developers",
    buildingName: "Tower A",
    phase: "Phase 1",
    floorNumber: "1",
    location: "Dubai Marina",
    price: 4500000,
    type: "Apartment",
    unitType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    internalArea: 1200,
    externalArea: 300,
    totalArea: 1500,
    internalAreaPrice: 3750,
    totalPricePerSqft: 3000,
    status: "Available",
    views: "Marina View",
    floorPlate: "A1",
  },
  {
    id: "imp-002",
    unitNumber: "DM-102",
    title: "Marina View Apartment 2",
    projectName: "Dubai Marina Towers",
    developerName: "Prime Developers",
    buildingName: "Tower A",
    phase: "Phase 1",
    floorNumber: "1",
    location: "Dubai Marina",
    price: 4800000,
    type: "Apartment",
    unitType: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    internalArea: 1500,
    externalArea: 300,
    totalArea: 1800,
    internalAreaPrice: 3200,
    totalPricePerSqft: 2667,
    status: "Available",
    views: "Marina View",
    floorPlate: "A1",
  },
  // Add more properties as needed
]

export async function GET() {
  return NextResponse.json(properties)
}
