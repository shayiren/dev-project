import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  views: string
}

interface DevelopmentCardProps {
  property: Property
}

export function DevelopmentCard({ property }: DevelopmentCardProps) {
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
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-video w-full bg-muted relative">
          <div className="absolute top-2 right-2">
            <Badge variant={getBadgeVariant(property.status)}>{property.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <CardTitle className="line-clamp-1">{property.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {property.projectName} - {property.buildingName}
          </div>
          <div className="text-sm text-muted-foreground">{property.location}</div>
          <div className="flex items-center justify-between">
            <div className="font-semibold">{formatCurrency(property.price)}</div>
            <div className="text-sm text-muted-foreground">{property.totalArea} sqft</div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div>{property.bedrooms} Bed</div>
            <div>{property.bathrooms} Bath</div>
            <div>{property.views}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          Details
        </Button>
        <Button size="sm">Edit</Button>
      </CardFooter>
    </Card>
  )
}
