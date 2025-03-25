// This is a mock database implementation
// In a real application, you would use a real database like MongoDB, PostgreSQL, etc.

// Define types for our data models
export interface User {
  id: string
  email: string
  password: string // In a real app, this would be hashed
  name: string
  role: "admin" | "agent" | "client"
  createdAt: Date
}

export interface Property {
  id: string
  title: string
  description: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  imageUrl: string
  propertyType: string
  listingType: "sale" | "rent"
  featured: boolean
  amenities: string[]
  yearBuilt: number
  status: "Active" | "Pending" | "Sold" | "Rented"
  createdAt: Date
  updatedAt: Date
  createdBy: string // User ID
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  notes: string
  createdAt: Date
  updatedAt: Date
  createdBy: string // User ID
}

export interface Sale {
  id: string
  propertyId: string
  clientId: string
  agentId: string
  price: number
  date: Date
  status: "Pending" | "Completed" | "Cancelled"
  notes: string
  createdAt: Date
  updatedAt: Date
}

// Mock data
const users: User[] = [
  {
    id: "user1",
    email: "admin@example.com",
    password: "password", // In a real app, this would be hashed
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "user2",
    email: "agent@example.com",
    password: "password", // In a real app, this would be hashed
    name: "Agent User",
    role: "agent",
    createdAt: new Date("2023-01-02"),
  },
  {
    id: "user3",
    email: "client@example.com",
    password: "password", // In a real app, this would be hashed
    name: "Client User",
    role: "client",
    createdAt: new Date("2023-01-03"),
  },
]

const properties: Property[] = [
  {
    id: "prop1",
    title: "Modern Apartment with Ocean View",
    description: "Stunning apartment with panoramic ocean views, modern finishes, and resort-style amenities.",
    location: "Miami Beach, FL",
    price: 450000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    imageUrl: "/placeholder.svg?height=400&width=600",
    propertyType: "apartment",
    listingType: "sale",
    featured: true,
    amenities: ["Pool", "Gym", "Concierge", "Parking", "Security"],
    yearBuilt: 2018,
    status: "Active",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    createdBy: "user2",
  },
  // Add more properties here...
]

const clients: Client[] = [
  {
    id: "client1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    address: "123 Main St, Anytown, USA",
    notes: "Looking for a 3-bedroom house in the suburbs",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-02-01"),
    createdBy: "user2",
  },
  // Add more clients here...
]

const sales: Sale[] = [
  {
    id: "sale1",
    propertyId: "prop1",
    clientId: "client1",
    agentId: "user2",
    price: 450000,
    date: new Date("2023-03-15"),
    status: "Completed",
    notes: "Smooth transaction, client very satisfied",
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
  // Add more sales here...
]

// Database operations
export const db = {
  // User operations
  users: {
    findAll: async () => [...users],
    findById: async (id: string) => users.find((u) => u.id === id) || null,
    findByEmail: async (email: string) => users.find((u) => u.email === email) || null,
    create: async (data: Omit<User, "id" | "createdAt">) => {
      const newUser: User = {
        id: `user${Date.now()}`,
        ...data,
        createdAt: new Date(),
      }
      users.push(newUser)
      return newUser
    },
    update: async (id: string, data: Partial<Omit<User, "id" | "createdAt">>) => {
      const index = users.findIndex((u) => u.id === id)
      if (index === -1) return null

      users[index] = { ...users[index], ...data }
      return users[index]
    },
    delete: async (id: string) => {
      const index = users.findIndex((u) => u.id === id)
      if (index === -1) return false

      users.splice(index, 1)
      return true
    },
  },

  // Property operations
  properties: {
    findAll: async () => [...properties],
    findById: async (id: string) => properties.find((p) => p.id === id) || null,
    findByType: async (type: string) => properties.filter((p) => p.propertyType === type),
    findByListingType: async (type: "sale" | "rent") => properties.filter((p) => p.listingType === type),
    findFeatured: async () => properties.filter((p) => p.featured),
    create: async (data: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
      const newProperty: Property = {
        id: `prop${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      properties.push(newProperty)
      return newProperty
    },
    update: async (id: string, data: Partial<Omit<Property, "id" | "createdAt" | "updatedAt">>) => {
      const index = properties.findIndex((p) => p.id === id)
      if (index === -1) return null

      properties[index] = {
        ...properties[index],
        ...data,
        updatedAt: new Date(),
      }
      return properties[index]
    },
    delete: async (id: string) => {
      const index = properties.findIndex((p) => p.id === id)
      if (index === -1) return false

      properties.splice(index, 1)
      return true
    },
  },

  // Client operations
  clients: {
    findAll: async () => [...clients],
    findById: async (id: string) => clients.find((c) => c.id === id) || null,
    findByEmail: async (email: string) => clients.find((c) => c.email === email) || null,
    create: async (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
      const newClient: Client = {
        id: `client${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      clients.push(newClient)
      return newClient
    },
    update: async (id: string, data: Partial<Omit<Client, "id" | "createdAt" | "updatedAt">>) => {
      const index = clients.findIndex((c) => c.id === id)
      if (index === -1) return null

      clients[index] = {
        ...clients[index],
        ...data,
        updatedAt: new Date(),
      }
      return clients[index]
    },
    delete: async (id: string) => {
      const index = clients.findIndex((c) => c.id === id)
      if (index === -1) return false

      clients.splice(index, 1)
      return true
    },
  },

  // Sale operations
  sales: {
    findAll: async () => [...sales],
    findById: async (id: string) => sales.find((s) => s.id === id) || null,
    findByPropertyId: async (propertyId: string) => sales.filter((s) => s.propertyId === propertyId),
    findByClientId: async (clientId: string) => sales.filter((s) => s.clientId === clientId),
    findByAgentId: async (agentId: string) => sales.filter((s) => s.agentId === agentId),
    create: async (data: Omit<Sale, "id" | "createdAt" | "updatedAt">) => {
      const newSale: Sale = {
        id: `sale${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      sales.push(newSale)
      return newSale
    },
    update: async (id: string, data: Partial<Omit<Sale, "id" | "createdAt" | "updatedAt">>) => {
      const index = sales.findIndex((s) => s.id === id)
      if (index === -1) return null

      sales[index] = {
        ...sales[index],
        ...data,
        updatedAt: new Date(),
      }
      return sales[index]
    },
    delete: async (id: string) => {
      const index = sales.findIndex((s) => s.id === id)
      if (index === -1) return false

      sales.splice(index, 1)
      return true
    },
  },
}

