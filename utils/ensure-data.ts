import { v4 as uuidv4 } from "uuid"
import { loadFromStorage, saveToStorage } from "./storage-utils"

// Check if we're running in a browser environment
const isBrowser = typeof window !== "undefined"

/**
 * Ensures that default developers and projects exist in localStorage
 * This function should be called on app initialization
 */
export function ensureDefaultData() {
  // Check if we're running in a browser environment
  if (!isBrowser) return

  try {
    // Set default currency to AED if not already set
    if (!localStorage.getItem("preferredCurrency")) {
      localStorage.setItem(
        "preferredCurrency",
        JSON.stringify({
          code: "AED",
          symbol: "AED ",
          name: "UAE Dirham",
          rate: 3.6725,
        }),
      )
    }

    // Sample developers data
    const sampleDevelopers = [
      {
        id: uuidv4(),
        name: "Prime Developers",
        contactPerson: "John Smith",
        email: "john@primedevelopers.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main Street, New York, NY 10001",
        website: "https://primedevelopers.com",
        description: "Luxury real estate developer with over 20 years of experience",
        projects: ["Sunset Residences", "Ocean View Towers"],
      },
      {
        id: uuidv4(),
        name: "City Builders",
        contactPerson: "Sarah Johnson",
        email: "sarah@citybuilders.com",
        phone: "+1 (555) 987-6543",
        address: "456 Park Avenue, New York, NY 10022",
        website: "https://citybuilders.com",
        description: "Urban development specialists focusing on modern living spaces",
        projects: ["Urban Heights", "Metropolitan Gardens"],
      },
      // Add more sample developers as needed
    ]

    // Sample projects data
    const sampleProjects = [
      {
        id: uuidv4(),
        name: "Sunset Residences",
        developerName: "Prime Developers",
        location: "Miami, FL",
        description: "Luxury beachfront condominiums with panoramic ocean views",
        totalUnits: 120,
      },
      {
        id: uuidv4(),
        name: "Ocean View Towers",
        developerName: "Prime Developers",
        location: "San Diego, CA",
        description: "High-rise luxury apartments with stunning ocean views",
        totalUnits: 200,
      },
      // Add more sample projects as needed
    ]

    // Sample properties data
    const sampleProperties = [
      {
        id: uuidv4(),
        unitNumber: "A101",
        title: "Modern Apartment with Ocean View",
        projectName: "Sunset Residences",
        developerName: "Prime Developers",
        buildingName: "Tower A",
        phase: "Phase 1",
        floorNumber: 1,
        unitType: "Apartment",
        bedrooms: 2,
        bathrooms: 2,
        internalArea: 950,
        externalArea: 250,
        totalArea: 1200,
        price: 450000,
        status: "Available",
        floorPlan: "/placeholder.svg?height=400&width=600",
        imageUrl: "/placeholder.svg?height=400&width=600",
      },
      {
        id: uuidv4(),
        unitNumber: "B202",
        title: "Luxury Villa with Pool",
        projectName: "Ocean View Towers",
        developerName: "Prime Developers",
        buildingName: "Block B",
        phase: "Phase 1",
        floorNumber: 2,
        unitType: "Villa",
        bedrooms: 5,
        bathrooms: 4,
        internalArea: 3500,
        externalArea: 1000,
        totalArea: 4500,
        price: 2500000,
        status: "Available",
        floorPlan: "/placeholder.svg?height=400&width=600",
        imageUrl: "/placeholder.svg?height=400&width=600",
      },
      // Add more sample properties as needed
    ]

    // Check if developers data exists
    const developers = loadFromStorage("realEstateDeveloperDetails", [])
    if (developers.length === 0) {
      // Save sample developers
      saveToStorage("realEstateDeveloperDetails", sampleDevelopers)

      // Also save to the old key for backward compatibility
      saveToStorage(
        "developers",
        sampleDevelopers.map((dev) => dev.name),
      )
    }

    // Check if projects data exists
    const projects = loadFromStorage("projects", [])
    if (projects.length === 0) {
      // Save sample projects
      saveToStorage("projects", sampleProjects)
    }

    // Check if properties data exists
    const properties = loadFromStorage("properties", [])
    if (properties.length === 0) {
      // Save sample properties
      saveToStorage("properties", sampleProperties)
    }
  } catch (error) {
    console.error("Error ensuring default data:", error)
  }
}
