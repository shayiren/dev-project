"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Property {
  id: number
  name: string
  project_id: number
  status: string
  property_type: string
  bedrooms: number
  view_type: string
  payment_plan: string
  handover_date: string
  price: number
  area: number
}

interface PropertyComparisonProps {
  properties: Property[]
  onClose: () => void
}

export function PropertyComparison({ properties, onClose }: PropertyComparisonProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">Property Comparison</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                {properties.map((property) => (
                  <TableHead key={property.id}>{property.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Status</TableCell>
                {properties.map((property) => (
                  <TableCell key={property.id}>{property.status}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Type</TableCell>
                {properties.map((property) => (
                  <TableCell key={property.id}>{property.property_type}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bedrooms</TableCell>
                {properties.map((property) => (
                  <TableCell key={property.id}>{property.bedrooms}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">View</TableCell>
                {properties.map((property) => (
                  <TableCell key={property.id}>{property.view_type}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Payment Plan</TableCell>
                {properties.map((property) => (
                  <TableCell key={property.id}>{property.payment_plan}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Handover Date</TableCell>
                {properties.map((property) => (
                  <TableCell key={property.id}>{new Date(property.handover_date).toLocaleDateString()}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Price</TableCell>
                {properties.map((property) => (
                  <TableCell key={property.id}>
                    {new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(property.price)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Area (sqft)</TableCell>
                {properties.map((property) => (
                  <TableCell key={property.id}>{property.area}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
