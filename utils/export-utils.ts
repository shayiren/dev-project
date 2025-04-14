/**
 * Utility functions for exporting property data
 */

// Function to get floor plate URL based on floor number
export const getFloorPlateUrl = (floorNo: string | null): string => {
  if (!floorNo) return "/placeholder.svg?height=400&width=600"

  // In a real app, you would have a mapping of floor numbers to floor plate URLs
  // For this demo, we'll just use a placeholder with the floor number
  return `/placeholder.svg?height=400&width=600&text=Floor ${floorNo} Plate`
}

// Function to export specific fields to CSV
export const exportSpecificFields = (properties: any[]): string => {
  const headers = [
    "Unit No.",
    "Status",
    "Unit Type",
    "Price",
    "Total Area (sqft)",
    "Floor No.",
    "Internal Area (sqft)",
    "External Area (sqft)",
    "Floor Plan",
    "Floor Plate",
  ]

  const rows = properties.map((p) => [
    p.id,
    p.status,
    p.type,
    p.price,
    p.area,
    p.floorNo || "N/A",
    p.internalArea || "N/A",
    p.externalArea || "N/A",
    p.floorPlan,
    getFloorPlateUrl(p.floorNo),
  ])

  return [headers.join(","), ...rows.map((row) => row.map((value) => `"${value}"`).join(","))].join("\n")
}

// Function to download CSV data
export const downloadCSV = (csvData: string, filename: string): void => {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Function to get status color classes
export const getStatusColorClasses = (status: string): { bg: string; text: string } => {
  switch (status) {
    case "Available":
      return { bg: "bg-green-500", text: "text-white" }
    case "Reserved":
      return { bg: "bg-blue-500", text: "text-white" }
    case "Blocked":
      return { bg: "bg-yellow-500", text: "text-black" }
    case "Sold":
      return { bg: "bg-red-500", text: "text-white" }
    case "Developer Hold":
      return { bg: "bg-purple-500", text: "text-white" }
    default:
      return { bg: "bg-gray-500", text: "text-white" }
  }
}

// Function to get row background color based on status
export const getRowBackgroundColor = (status: string): string => {
  switch (status) {
    case "Reserved":
      return "bg-blue-100"
    case "Blocked":
      return "bg-yellow-100"
    case "Sold":
      return "bg-red-100"
    default:
      return ""
  }
}
