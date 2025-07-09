import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, CheckCircle, Clock, Home } from "lucide-react"

interface InventoryStatsProps {
  totalUnits: number
  availableUnits: number
  reservedUnits: number
  soldUnits: number
}

export function InventoryStats({ totalUnits, availableUnits, reservedUnits, soldUnits }: InventoryStatsProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Units</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUnits}</div>
          <p className="text-xs text-muted-foreground">Total inventory in all developments</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableUnits}</div>
          <p className="text-xs text-muted-foreground">
            {((availableUnits / totalUnits) * 100).toFixed(1)}% of total inventory
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reserved</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reservedUnits}</div>
          <p className="text-xs text-muted-foreground">
            {((reservedUnits / totalUnits) * 100).toFixed(1)}% of total inventory
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sold</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{soldUnits}</div>
          <p className="text-xs text-muted-foreground">
            {((soldUnits / totalUnits) * 100).toFixed(1)}% of total inventory
          </p>
        </CardContent>
      </Card>
    </>
  )
}
