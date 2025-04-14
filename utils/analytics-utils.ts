/**
 * Utility functions for generating analytics data
 */

// Get counts of properties by status
export function getPropertyStatusCounts(properties: any[]) {
  const counts = {
    Available: 0,
    Reserved: 0,
    "Under Offer": 0,
    Sold: 0,
    "Developer Hold": 0,
    Total: properties.length,
  }

  properties.forEach((property) => {
    if (counts.hasOwnProperty(property.status)) {
      counts[property.status as keyof typeof counts]++
    }
  })

  return counts
}

// Get monthly data for the past 6 months
export function getMonthlyData(properties: any[]) {
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

// Calculate month-on-month growth
export function calculateMonthlyGrowth(monthlyData: any[]) {
  if (monthlyData.length < 2) return { percentage: 0, isPositive: true }

  const currentMonth = monthlyData[monthlyData.length - 1].total
  const previousMonth = monthlyData[monthlyData.length - 2].total

  if (previousMonth === 0) return { percentage: 100, isPositive: true }

  const growthPercentage = ((currentMonth - previousMonth) / previousMonth) * 100

  return {
    percentage: Math.abs(growthPercentage).toFixed(1),
    isPositive: growthPercentage >= 0,
  }
}
