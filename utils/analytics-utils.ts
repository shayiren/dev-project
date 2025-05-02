/**
 * Utility functions for analytics
 */

// Get counts of properties by status
export function getPropertyStatusCounts(properties: any[]) {
  const statusCounts = {
    Available: 0,
    Reserved: 0,
    Sold: 0,
    "Under Offer": 0,
  }

  properties.forEach((property) => {
    if (property.status && statusCounts.hasOwnProperty(property.status)) {
      statusCounts[property.status as keyof typeof statusCounts]++
    }
  })

  return statusCounts
}

// Function to get monthly data
export function getMonthlyData(properties: any[]) {
  const now = new Date()
  const monthsData = []

  // Generate data for the last 6 months
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = month.toLocaleString("default", { month: "short" })

    monthsData.push({
      name: monthName,
      total: 0,
    })
  }

  // Count properties sold in each month
  properties.forEach((property) => {
    if (property.status === "Sold" && property.soldDate) {
      const soldDate = new Date(property.soldDate)
      const monthIndex = 5 - (now.getMonth() - soldDate.getMonth() + (now.getFullYear() - soldDate.getFullYear()) * 12)

      if (monthIndex >= 0 && monthIndex < 6) {
        monthsData[monthIndex].total += 1
      }
    }
  })

  return monthsData
}

// Function to calculate monthly growth
export function calculateMonthlyGrowth(monthlyData: any[]) {
  if (monthlyData.length < 2) return 0

  const currentMonth = monthlyData[monthlyData.length - 1].total
  const previousMonth = monthlyData[monthlyData.length - 2].total

  if (previousMonth === 0) return currentMonth > 0 ? 100 : 0

  return ((currentMonth - previousMonth) / previousMonth) * 100
}

// Get property analytics
export function getPropertyAnalytics(properties: any[]) {
  // Default return if no properties
  if (!properties || properties.length === 0) {
    return {
      totalProperties: 0,
      availableProperties: 0,
      soldProperties: 0,
      reservedProperties: 0,
      underOfferProperties: 0,
      averagePrice: 0,
      averageSize: 0,
      pricePerSqft: 0,
      propertyTypeDistribution: {},
      bedroomDistribution: {},
      priceRangeDistribution: {},
      salesVelocity: 0,
      inventoryValue: 0,
      soldValue: 0,
    }
  }

  // Count properties by status
  const availableProperties = properties.filter((p) => p.status === "Available").length
  const soldProperties = properties.filter((p) => p.status === "Sold").length
  const reservedProperties = properties.filter((p) => p.status === "Reserved").length
  const underOfferProperties = properties.filter((p) => p.status === "Under Offer").length

  // Calculate average price
  const totalPrice = properties.reduce((sum, property) => sum + (property.price || 0), 0)
  const averagePrice = totalPrice / properties.length

  // Calculate average size
  const totalSize = properties.reduce((sum, property) => sum + (property.totalArea || 0), 0)
  const averageSize = totalSize / properties.length

  // Calculate price per sqft
  const pricePerSqft = totalSize > 0 ? totalPrice / totalSize : 0

  // Calculate property type distribution
  const propertyTypeDistribution = properties.reduce((acc, property) => {
    const type = property.unitType || "Unknown"
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  // Calculate bedroom distribution
  const bedroomDistribution = properties.reduce((acc, property) => {
    const bedrooms = property.bedrooms || 0
    const key = bedrooms.toString()
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // Calculate price range distribution
  const priceRangeDistribution = properties.reduce((acc, property) => {
    const price = property.price || 0
    let range = "Unknown"

    if (price < 500000) range = "< 500K"
    else if (price < 1000000) range = "500K - 1M"
    else if (price < 2000000) range = "1M - 2M"
    else if (price < 5000000) range = "2M - 5M"
    else range = "> 5M"

    acc[range] = (acc[range] || 0) + 1
    return acc
  }, {})

  // Calculate sales velocity (properties sold per month)
  // For this example, we'll use a simple calculation
  // In a real app, you would use actual dates
  const salesVelocity = soldProperties / 3 // Assuming 3 months of data

  // Calculate total inventory value
  const inventoryValue = properties
    .filter((p) => p.status === "Available")
    .reduce((sum, property) => sum + (property.price || 0), 0)

  // Calculate total sold value
  const soldValue = properties
    .filter((p) => p.status === "Sold")
    .reduce((sum, property) => sum + (property.price || 0), 0)

  return {
    totalProperties: properties.length,
    availableProperties,
    soldProperties,
    reservedProperties,
    underOfferProperties,
    averagePrice,
    averageSize,
    pricePerSqft,
    propertyTypeDistribution,
    bedroomDistribution,
    priceRangeDistribution,
    salesVelocity,
    inventoryValue,
    soldValue,
  }
}

// Calculate monthly sales data
export function getMonthlySalesData(properties: any[]) {
  const soldProperties = properties.filter((p) => p.status === "Sold" && p.soldDate)

  // Create a map for the last 6 months
  const months = []
  const currentDate = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate)
    date.setMonth(currentDate.getMonth() - i)
    const monthName = date.toLocaleString("default", { month: "short" })
    const year = date.getFullYear()
    months.push({
      name: `${monthName} ${year}`,
      month: date.getMonth(),
      year: date.getFullYear(),
      value: 0,
      count: 0,
    })
  }

  // Populate the data
  soldProperties.forEach((property) => {
    if (!property.soldDate) return

    const soldDate = new Date(property.soldDate)
    const month = soldDate.getMonth()
    const year = soldDate.getFullYear()

    const monthData = months.find((m) => m.month === month && m.year === year)
    if (monthData) {
      monthData.value += property.price || 0
      monthData.count += 1
    }
  })

  return months
}

// Get property comparison data
export function getPropertyComparisonData(properties: any[]) {
  // Group properties by type
  const typeGroups = properties.reduce((acc, property) => {
    const type = property.unitType || "Unknown"
    if (!acc[type]) acc[type] = []
    acc[type].push(property)
    return acc
  }, {})

  // Calculate averages for each type
  const comparisonData = Object.entries(typeGroups).map(([type, props]: [string, any[]]) => {
    const avgPrice = props.reduce((sum, p) => sum + (p.price || 0), 0) / props.length
    const avgSize = props.reduce((sum, p) => sum + (p.totalArea || 0), 0) / props.length
    const avgPricePerSqft = avgSize > 0 ? avgPrice / avgSize : 0

    return {
      type,
      avgPrice,
      avgSize,
      avgPricePerSqft,
      count: props.length,
    }
  })

  return comparisonData
}

// Get property inventory status
export function getInventoryStatus(properties: any[]) {
  const total = properties.length
  const available = properties.filter((p) => p.status === "Available").length
  const sold = properties.filter((p) => p.status === "Sold").length
  const reserved = properties.filter((p) => p.status === "Reserved").length
  const underOffer = properties.filter((p) => p.status === "Under Offer").length

  return [
    { name: "Available", value: available },
    { name: "Sold", value: sold },
    { name: "Reserved", value: reserved },
    { name: "Under Offer", value: underOffer },
  ]
}
