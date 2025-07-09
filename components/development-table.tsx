import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

interface Property {
  id: string
  unitNumber: string
  title: string
  projectName: string
  developerName: string
  buildingName: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  totalArea: number
  status: string
}

interface DevelopmentTableProps {
  properties: Property[]
}

export function DevelopmentTable({ properties }: DevelopmentTableProps) {
  // Function to determine badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Available":
        return "default"
      case "Reserved":
        return "secondary"
      case "Under Offer":
        return "warning"
      case "Sold":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unit</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Beds</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell className="font-medium">{property.unitNumber}</TableCell>
              <TableCell>{property.projectName}</TableCell>
              <TableCell>{property.location}</TableCell>
              <TableCell>{formatCurrency(property.price)}</TableCell>
              <TableCell>{property.bedrooms}</TableCell>
              <TableCell>{property.totalArea} sqft</TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(property.status)}>{property.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
