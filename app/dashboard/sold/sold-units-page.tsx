"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCurrency } from "@/hooks/use-currency"
import { loadFromStorage } from "@/utils/storage-utils"
import { formatCurrency } from "@/utils/format-utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function SoldUnitsPage() {
  const [soldProperties, setSoldProperties] = useState<any[]>([])
  const { currency, currencySymbol } = useCurrency()

  useEffect(() => {
    // Load properties from storage
    const allProperties = loadFromStorage<any[]>("properties", [])
    // Filter only sold properties
    const sold = allProperties.filter((property) => property.status === "Sold")
    setSoldProperties(sold)
  }, [])

  // Calculate total sales value
  const totalSalesValue = soldProperties.reduce((total, property) => total + property.price, 0)

  // Prepare data for bedroom distribution chart
  const bedroomCounts = soldProperties.reduce((acc: Record<string, number>, property) => {
    const bedrooms = property.bedrooms || 0
    acc[`${bedrooms} BR`] = (acc[`${bedrooms} BR`] || 0) + 1
    return acc
  }, {})

  const bedroomChartData = Object.entries(bedroomCounts).map(([name, count]) => ({
    name,
    count,
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sold Units</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Units Sold</CardTitle>
            <CardDescription>Total number of sold properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{soldProperties.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Sales Value</CardTitle>
            <CardDescription>Combined value of all sold properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalSalesValue, currency, currencySymbol)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bedroom Distribution</CardTitle>
          <CardDescription>Distribution of sold units by bedroom count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bedroomChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} Units`, "Count"]} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sold Properties</CardTitle>
          <CardDescription>Detailed list of all sold properties</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit ID</TableHead>
                <TableHead>Project</TableHead>
                {/* Developer name column hidden as requested */}
                <TableHead>Type</TableHead>
                <TableHead>Area (sqft)</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Agency Name</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Sale Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {soldProperties.length > 0 ? (
                soldProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.unitNumber || property.id}</TableCell>
                    <TableCell>{property.projectName}</TableCell>
                    {/* Developer name cell removed */}
                    <TableCell>{property.bedrooms ? `${property.bedrooms} Bedroom` : property.type}</TableCell>
                    <TableCell>{property.internalArea}</TableCell>
                    <TableCell>{formatCurrency(property.price, currency, currencySymbol)}</TableCell>
                    <TableCell>{property.clientInfo?.clientName || "N/A"}</TableCell>
                    <TableCell>{property.clientInfo?.agencyName || "N/A"}</TableCell>
                    <TableCell>{property.clientInfo?.agentName || "N/A"}</TableCell>
                    <TableCell>{property.soldDate || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No sold properties found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default SoldUnitsPage
