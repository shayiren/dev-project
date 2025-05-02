import { v4 as uuidv4 } from "uuid"
import { setLocalStorage, getLocalStorage } from "./storage-utils"

// Sample project names
const projectNames = [
  "Sunset Heights",
  "Marina Bay Residences",
  "Palm Grove Estates",
  "Skyline Towers",
  "Riverside Gardens",
  "Mountain View Villas",
  "Ocean Breeze Condos",
  "City Center Lofts",
  "Green Valley Homes",
  "Lakeside Apartments",
]

// Sample property types
const propertyTypes = ["Apartment", "Villa", "Townhouse", "Penthouse", "Studio", "Duplex", "Loft", "Condo"]

// Sample locations
const locations = [
  "Downtown",
  "Waterfront",
  "Suburban",
  "Beachfront",
  "City Center",
  "Hillside",
  "Lakefront",
  "Business District",
]

// Sample views
const views = [
  "Ocean View",
  "City View",
  "Garden View",
  "Mountain View",
  "Lake View",
  "Park View",
  "Pool View",
  "Street View",
]

// Sample statuses
const statuses = ["Available", "Reserved", "Under Offer", "Sold"]

// Sample client names
const clientNames = [
  "John Smith",
  "Emma Johnson",
  "Michael Brown",
  "Sophia Davis",
  "William Wilson",
  "Olivia Martinez",
  "James Taylor",
  "Ava Anderson",
  "Robert Thomas",
  "Isabella Jackson",
]

// Sample agent names
const agentNames = [
  "David Miller",
  "Sarah Wilson",
  "Christopher Lee",
  "Jennifer Garcia",
  "Matthew Rodriguez",
  "Elizabeth Martinez",
  "Daniel Thompson",
  "Samantha Lewis",
  "Andrew Walker",
  "Victoria Hall",
]

// Sample agency names
const agencyNames = [
  "Premier Properties",
  "Elite Real Estate",
  "Luxury Homes",
  "City Living Realty",
  "Coastal Properties",
  "Modern Spaces",
  "Urban Dwellings",
  "Prestige Real Estate",
  "Horizon Properties",
  "Metropolitan Realty",
]

// Generate a random number between min and max
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate a random element from an array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Generate a random date within the last year
function getRandomDate(): string {
  const now = new Date()
  const pastDate = new Date(now.setMonth(now.getMonth() - getRandomNumber(0, 12)))
  return pastDate.toISOString().split("T")[0]
}

// Generate client details for non-available properties
function generateClientDetails(status: string) {
  if (status === "Available") {
    return null
  }

  return {
    clientName: getRandomElement(clientNames),
    clientEmail: `${getRandomElement(clientNames).toLowerCase().replace(" ", ".")}@example.com`,
    agencyName: Math.random() > 0.3 ? getRandomElement(agencyNames) : "",
    agentName: getRandomElement(agentNames),
  }
}

// Generate a single sample property
function generateSampleProperty() {
  const status = getRandomElement(statuses)
  const bedrooms = getRandomNumber(0, 5)
  const bathrooms = getRandomNumber(1, bedrooms + 1)
  const price = getRandomNumber(100000, 2000000)
  const area = getRandomNumber(500, 5000)

  return {
    id: uuidv4(),
    name: `Unit ${getRandomNumber(101, 999)}`,
    projectName: getRandomElement(projectNames),
    propertyType: getRandomElement(propertyTypes),
    location: getRandomElement(locations),
    address: `${getRandomNumber(1, 999)} ${getRandomElement(["Main St", "Park Ave", "Ocean Blvd", "Mountain Rd", "Lake Dr"])}`,
    price: price,
    pricePerSqFt: Math.round(price / area),
    area: area,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    view: getRandomElement(views),
    floor: getRandomNumber(1, 30),
    unitNumber: `${getRandomNumber(1, 9)}${getRandomNumber(0, 9)}${getRandomNumber(0, 9)}${getRandomElement(["A", "B", "C", "D", ""])}`,
    status: status,
    description: `Beautiful ${bedrooms}-bedroom ${getRandomElement(propertyTypes).toLowerCase()} with stunning ${getRandomElement(views).toLowerCase()} in the heart of ${getRandomElement(locations).toLowerCase()}.`,
    features: ["Modern Kitchen", "Hardwood Floors", "Walk-in Closet", "Smart Home System", "Private Balcony"].slice(
      0,
      getRandomNumber(2, 5),
    ),
    images: [
      `/placeholder.svg?height=400&width=600&query=luxury+${getRandomElement(propertyTypes).toLowerCase()}+interior`,
      `/placeholder.svg?height=400&width=600&query=modern+${getRandomElement(propertyTypes).toLowerCase()}+kitchen`,
      `/placeholder.svg?height=400&width=600&query=elegant+${getRandomElement(propertyTypes).toLowerCase()}+bathroom`,
    ],
    createdAt: getRandomDate(),
    updatedAt: new Date().toISOString().split("T")[0],
    soldDate: status === "Sold" ? getRandomDate() : null,
    clientDetails: generateClientDetails(status),
  }
}

// Add sample properties to localStorage
export function addSampleProperties(count = 30) {
  // Get existing properties
  const existingProperties = getLocalStorage("properties") || []

  // Generate new sample properties
  const newProperties = Array.from({ length: count }, () => generateSampleProperty())

  // Combine existing and new properties
  const allProperties = [...existingProperties, ...newProperties]

  // Save to localStorage
  setLocalStorage("properties", allProperties)

  return newProperties.length
}

// Add sample projects to localStorage if they don't exist
export function ensureSampleProjects() {
  const existingProjects = getLocalStorage("projects") || []

  if (existingProjects.length < 5) {
    const newProjects = projectNames.slice(0, 10).map((name, index) => ({
      id: uuidv4(),
      name,
      developer: getRandomElement(["ABC Developers", "XYZ Construction", "123 Properties", "Global Builders"]),
      location: getRandomElement(locations),
      description: `A premium ${getRandomElement(["residential", "mixed-use", "luxury", "affordable"])} development in ${getRandomElement(locations)}.`,
      status: getRandomElement(["In Progress", "Completed", "Planning", "On Hold"]),
      completionDate: new Date(new Date().setMonth(new Date().getMonth() + getRandomNumber(6, 36)))
        .toISOString()
        .split("T")[0],
      totalUnits: getRandomNumber(50, 500),
      createdAt: getRandomDate(),
    }))

    setLocalStorage("projects", [...existingProjects, ...newProjects])
  }
}

// Add sample developers to localStorage if they don't exist
export function ensureSampleDevelopers() {
  const existingDevelopers = getLocalStorage("realEstateDeveloperDetails") || []

  if (existingDevelopers.length < 5) {
    const newDevelopers = [
      "ABC Developers",
      "XYZ Construction",
      "123 Properties",
      "Global Builders",
      "City Developers",
      "Modern Constructions",
      "Premier Builders",
      "Elite Developers",
    ]
      .slice(0, 8)
      .map((name, index) => ({
        id: uuidv4(),
        name,
        contactPerson: getRandomElement(clientNames),
        email: `info@${name.toLowerCase().replace(/\s+/g, "")}.com`,
        phone: `+1-${getRandomNumber(100, 999)}-${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`,
        address: `${getRandomNumber(1, 999)} ${getRandomElement(["Corporate Blvd", "Business Park", "Commerce St", "Industry Ave"])}`,
        website: `https://www.${name.toLowerCase().replace(/\s+/g, "")}.com`,
        createdAt: getRandomDate(),
      }))

    setLocalStorage("realEstateDeveloperDetails", [...existingDevelopers, ...newDevelopers])
  }
}

// Initialize all sample data
export function initializeSampleData(propertyCount = 30) {
  ensureSampleProjects()
  ensureSampleDevelopers()
  return addSampleProperties(propertyCount)
}
