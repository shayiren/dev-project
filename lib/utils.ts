import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStatusColor = (status: string, type: "bg" | "text" | "border") => {
  switch (status) {
    case "Available":
      return type === "bg" ? "rgba(0, 200, 83, 0.1)" : type === "text" ? "#00c853" : "rgba(0, 200, 83, 0.5)"
    case "Reserved":
      return type === "bg" ? "rgba(255, 152, 0, 0.1)" : type === "text" ? "#ff9800" : "rgba(255, 152, 0, 0.5)"
    case "Sold":
      return type === "bg" ? "rgba(244, 67, 54, 0.1)" : type === "text" ? "#f44336" : "rgba(244, 67, 54, 0.5)"
    case "Under Offer":
      return type === "bg" ? "rgba(33, 150, 243, 0.1)" : type === "text" ? "#2196f3" : "rgba(33, 150, 243, 0.5)"
    default:
      return type === "bg" ? "transparent" : type === "text" ? "inherit" : "transparent"
  }
}

export const exportToCSV = (data: any[], fields: { label: string; value: string }[], filename: string) => {
  // Create CSV header
  const header = fields.map((field) => field.label).join(",")

  // Create CSV rows
  const rows = data.map((item) => {
    return fields
      .map((field) => {
        const value = item[field.value]
        // Handle strings with commas by wrapping in quotes
        return typeof value === "string" && value.includes(",") ? `"${value}"` : value
      })
      .join(",")
  })

  // Combine header and rows
  const csv = [header, ...rows].join("\n")

  // Create download link
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToExcel = (data: any[], fields: { label: string; value: string }[], filename: string) => {
  // For simplicity, we'll just use CSV export as a fallback
  // In a real app, you would use a library like xlsx
  exportToCSV(data, fields, filename)
}
