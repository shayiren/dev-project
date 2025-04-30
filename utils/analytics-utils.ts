/**
 * Utility functions for generating property analytics data
 */

// Function to get property status counts
export function getPropertyStatusCounts(properties: any[]): Record<string, number> {
  const counts: Record<string, number> = {
    Total: properties.length,
    Available: 0,
    Reserved: 0,
    "Under Offer": 0,
    Sold: 0,
    "Developer Hold": 0,
  }

  properties.forEach((property) => {
    if (counts.hasOwnProperty(property.status)) {
      counts[property.status as keyof typeof counts]++
    }
  })

  return counts
}

// Function to get monthly data
export function getMonthlyData(properties: any[]): any[] {
  const today = new Date()
  const monthlyData = []

  // Generate data for the past 6 months
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthName = month.toLocaleString("default", { month: "short" })
    const year = month.getFullYear()

    // Count properties sold in this month
    const soldCount = properties.filter((property) => {
      if (!property.soldDate) return false
      const soldDate = new Date(property.soldDate)
      return soldDate.getMonth() === month.getMonth() && soldDate.getFullYear() === month.getFullYear()
    }).length

    // Count properties reserved in this month
    const reservedCount = properties.filter((property) => {
      if (property.status !== "Reserved") return false
      // If we had reservation date, we would use it here
      // For now, we'll use a random number for demonstration
      return Math.floor(Math.random() * 10) + 1
    }).length

    monthlyData.push({
      month: `${monthName} ${year}`,
      sold: soldCount,
      reserved: reservedCount,
      total: soldCount + reservedCount,
    })
  }

  return monthlyData
}

// Function to calculate monthly growth
export function calculateMonthlyGrowth(monthlyData: any[]): { percentage: string; isPositive: boolean } {
  if (monthlyData.length < 2) {
    return { percentage: "0", isPositive: true }
  }

  const currentMonth = monthlyData[monthlyData.length - 1].total
  const previousMonth = monthlyData[monthlyData.length - 2].total

  if (previousMonth === 0) return { percentage: "100", isPositive: true }

  const growthPercentage = ((currentMonth - previousMonth) / previousMonth) * 100

  return {
    percentage: Math.abs(growthPercentage).toFixed(1),
    isPositive: growthPercentage >= 0,
  }
}

// Adding the missing getPropertyAnalytics function
export function getPropertyAnalytics(properties: any[]) {
  // Calculate average price
  const totalPrice = properties.reduce((sum, property) => sum + (Number.parseFloat(property.price) || 0), 0)
  const averagePrice = properties.length > 0 ? totalPrice / properties.length : 0

  // Calculate average size
  const totalSize = properties.reduce((sum, property) => sum + (Number.parseFloat(property.size) || 0), 0)
  const averageSize = properties.length > 0 ? totalSize / properties.length : 0

  // Calculate price per square meter/foot
  const pricePerUnit = averageSize > 0 ? averagePrice / averageSize : 0

  // Get property types distribution
  const propertyTypes: Record<string, number> = {}
  properties.forEach((property) => {
    const type = property.type || "Unknown"
    propertyTypes[type] = (propertyTypes[type] || 0) + 1
  })

  // Get bedroom distribution
  const bedroomCounts: Record<string, number> = {}
  properties.forEach((property) => {
    const bedrooms = property.bedrooms?.toString() || "Unknown"
    bedroomCounts[bedrooms] = (bedroomCounts[bedrooms] || 0) + 1
  })

  // Get price ranges
  const priceRanges = {
    "Under 100k": 0,
    "100k-250k": 0,
    "250k-500k": 0,
    "500k-1M": 0,
    "Over 1M": 0,
  }

  properties.forEach((property) => {
    const price = Number.parseFloat(property.price) || 0
    if (price < 100000) priceRanges["Under 100k"]++
    else if (price < 250000) priceRanges["100k-250k"]++
    else if (price < 500000) priceRanges["250k-500k"]++
    else if (price < 1000000) priceRanges["500k-1M"]++
    else priceRanges["Over 1M"]++
  })

  return {
    totalProperties: properties.length,
    averagePrice,
    averageSize,
    pricePerUnit,
    propertyTypes,
    bedroomCounts,
    priceRanges,
  }
}
