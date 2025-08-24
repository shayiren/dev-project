// Define the Property type
export interface Property {
  id: number
  unitNumber: string
  projectName: string
  towerName: string
  type: string
  location: string
  internalArea: number
  externalArea: number
  totalArea: number
  price: number
  status: "Available" | "Reserved" | "Sold" | "Blocked" | "Developer Hold"
  phase: string
  bedrooms: number
  bathrooms: number
  floor: number
  view: string
  address: string
  city: string
  state: string
  zip: string
  internalTag?: boolean
  externalTag?: boolean
  priceHistory?: any[]
  salesOfferFile?: string
  salesOfferUploadDate?: string
  salesOfferVersion?: string
  salesOfferValidUntil?: string
  salesOfferDescription?: string
  reservedBy?: string
  reservedDate?: string
  soldBy?: string
  soldDate?: string
  soldPrice?: number
  saleType?: "christies" | "external_agency"
  externalAgencyName?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  notes?: string
}

// Sample property data with proper defaults
export const properties: Property[] = [
  {
    id: 1,
    unitNumber: "V-A1-001",
    projectName: "Luxury Villa A1",
    towerName: "Tower A",
    type: "Villa",
    location: "Palm Jumeirah, Dubai",
    internalArea: 5000,
    externalArea: 2000,
    totalArea: 7000,
    price: 18365000,
    status: "Available",
    phase: "Phase 1",
    bedrooms: 5,
    bathrooms: 6,
    floor: 1,
    view: "Sea View",
    address: "Villa A1-001, Palm Jumeirah",
    city: "Dubai",
    state: "Dubai",
    zip: "00000",
    internalTag: true,
    externalTag: true,
    priceHistory: [
      {
        id: "1",
        propertyId: 1,
        oldPrice: 18000000,
        newPrice: 18365000,
        oldPricePerSqft: 2571.43,
        newPricePerSqft: 2623.57,
        changeDate: "2024-01-10T10:30:00Z",
        changedBy: "Admin User",
        changeReason: "Market adjustment",
        changeType: "manual_price",
      },
    ],
  },
  {
    id: 2,
    unitNumber: "A-B2-1502",
    projectName: "Modern Apartment B2",
    towerName: "Tower B",
    type: "Apartment",
    location: "Dubai Marina",
    internalArea: 1200,
    externalArea: 100,
    totalArea: 1300,
    price: 1600000,
    status: "Reserved",
    phase: "Phase 2",
    bedrooms: 2,
    bathrooms: 2,
    floor: 15,
    view: "Marina View",
    address: "Apartment B2-1502, Dubai Marina",
    city: "Dubai",
    state: "Dubai",
    zip: "00000",
    internalTag: true,
    externalTag: false,
    priceHistory: [
      {
        id: "2",
        propertyId: 2,
        oldPrice: 1550000,
        newPrice: 1600000,
        oldPricePerSqft: 1192.31,
        newPricePerSqft: 1230.77,
        changeDate: "2024-01-08T14:15:00Z",
        changedBy: "Internal Agent",
        changeReason: "Competitive pricing",
        changeType: "price_per_sqft",
      },
    ],
    reservedBy: "Ahmed Al-Rashid",
    reservedDate: "2024-01-15",
    saleType: "christies",
    clientName: "John Smith",
    clientEmail: "john.smith@email.com",
    clientPhone: "+971 50 123 4567",
  },
  {
    id: 3,
    unitNumber: "C-C3-0501",
    projectName: "Commercial Space C3",
    towerName: "Tower C",
    type: "Commercial",
    location: "Business Bay, Dubai",
    internalArea: 3000,
    externalArea: 0,
    totalArea: 3000,
    price: 5000000,
    status: "Sold",
    phase: "Developer Holding",
    bedrooms: 0,
    bathrooms: 2,
    floor: 5,
    view: "City View",
    address: "Commercial Space C3-0501, Business Bay",
    city: "Dubai",
    state: "Dubai",
    zip: "00000",
    internalTag: false,
    externalTag: true,
    soldBy: "Sarah Johnson",
    soldDate: "2024-01-10",
    soldPrice: 4800000,
    saleType: "external_agency",
    externalAgencyName: "Dubai Properties LLC",
    clientName: "Ahmed Al-Mansouri",
    clientEmail: "ahmed@company.ae",
    clientPhone: "+971 50 987 6543",
    notes: "Sold to corporate client",
  },
  {
    id: 4,
    unitNumber: "P-D4-2201",
    projectName: "Penthouse D4",
    towerName: "Tower D",
    type: "Penthouse",
    location: "Downtown Dubai",
    internalArea: 4500,
    externalArea: 1500,
    totalArea: 6000,
    price: 25000000,
    status: "Available",
    phase: "Phase 3",
    bedrooms: 4,
    bathrooms: 5,
    floor: 22,
    view: "Burj Khalifa View",
    address: "Penthouse D4-2201, Downtown Dubai",
    city: "Dubai",
    state: "Dubai",
    zip: "00000",
    internalTag: true,
    externalTag: true,
  },
  {
    id: 5,
    unitNumber: "S-E5-0102",
    projectName: "Studio E5",
    towerName: "Tower E",
    type: "Studio",
    location: "Jumeirah Village Circle",
    internalArea: 500,
    externalArea: 50,
    totalArea: 550,
    price: 650000,
    status: "Available",
    phase: "Phase 1",
    bedrooms: 0,
    bathrooms: 1,
    floor: 1,
    view: "Garden View",
    address: "Studio E5-0102, Jumeirah Village Circle",
    city: "Dubai",
    state: "Dubai",
    zip: "00000",
    internalTag: true,
    externalTag: true,
  },
]
