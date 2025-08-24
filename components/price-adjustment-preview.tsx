"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, Calculator } from "lucide-react"

interface PreviewData {
  id: number
  unitNumber: string
  projectName: string
  towerName: string
  type: string
  bedrooms: number
  totalArea: number
  oldPrice: number
  newPrice: number
  oldPricePerSqft: number
  newPricePerSqft: number
  priceChange: number
  percentageChange: number
}

interface PriceAdjustmentPreviewProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  previewData: PreviewData[]
  adjustmentType: "percentage" | "fixed_amount" | "price_per_sqft"
  adjustmentValue: string
}

export function PriceAdjustmentPreview({
  isOpen,
  onClose,
  onConfirm,
  previewData,
  adjustmentType,
  adjustmentValue,
}: PriceAdjustmentPreviewProps) {
  console.log("Preview dialog props:", { isOpen, previewData, adjustmentType, adjustmentValue }) // Debug log

  // Early return if no data
  if (!previewData || previewData.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>No Preview Data</DialogTitle>
            <DialogDescription>No properties selected or no valid adjustment value provided.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const formatArea = (area: number): string => {
    return new Intl.NumberFormat("en-AE", { maximumFractionDigits: 2 }).format(area || 0)
  }

  // Calculate summary statistics
  const totalOldValue = previewData.reduce((sum, item) => sum + item.oldPrice, 0)
  const totalNewValue = previewData.reduce((sum, item) => sum + item.newPrice, 0)
  const totalChange = totalNewValue - totalOldValue
  const averagePercentageChange = previewData.reduce((sum, item) => sum + item.percentageChange, 0) / previewData.length

  const isIncrease = totalChange > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Price Adjustment Preview</span>
          </DialogTitle>
          <DialogDescription>
            Review the price changes before applying them to {previewData.length} properties.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Properties</p>
                    <p className="text-2xl font-bold">{previewData.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Old Value</p>
                    <p className="text-lg font-bold">{formatCurrency(totalOldValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total New Value</p>
                    <p className="text-lg font-bold">{formatCurrency(totalNewValue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  {isIncrease ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Change</p>
                    <p className={`text-lg font-bold ${isIncrease ? "text-green-600" : "text-red-600"}`}>
                      {isIncrease ? "+" : ""}
                      {formatCurrency(totalChange)}
                    </p>
                    <p className={`text-xs ${isIncrease ? "text-green-600" : "text-red-600"}`}>
                      {averagePercentageChange > 0 ? "+" : ""}
                      {averagePercentageChange.toFixed(1)}% avg
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Adjustment Summary */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Adjustment Summary:</div>
                <div>
                  <strong>Type:</strong>{" "}
                  {adjustmentType === "percentage"
                    ? "Percentage Adjustment"
                    : adjustmentType === "fixed_amount"
                      ? "Fixed Amount Adjustment"
                      : "Price per Square Foot"}
                </div>
                <div>
                  <strong>Value:</strong>{" "}
                  {adjustmentType === "percentage"
                    ? `${adjustmentValue}%`
                    : adjustmentType === "fixed_amount"
                      ? formatCurrency(Number.parseFloat(adjustmentValue))
                      : `${formatCurrency(Number.parseFloat(adjustmentValue))} per sqft`}
                </div>
                <div>
                  <strong>Impact:</strong> {isIncrease ? "Price Increase" : "Price Decrease"} of{" "}
                  <span className={isIncrease ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(Math.abs(totalChange))}
                  </span>{" "}
                  across all selected properties
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Detailed Preview Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Price Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Number</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>New Price</TableHead>
                      <TableHead>Price Change</TableHead>
                      <TableHead>% Change</TableHead>
                      <TableHead>Old Price/Sqft</TableHead>
                      <TableHead>New Price/Sqft</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.unitNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.projectName}</div>
                            <div className="text-sm text-gray-500">{item.towerName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{item.type}</div>
                            <div className="text-sm text-gray-500">{item.bedrooms} BR</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatArea(item.totalArea)} sqft</TableCell>
                        <TableCell className="font-medium">{formatCurrency(item.oldPrice)}</TableCell>
                        <TableCell className="font-bold text-blue-600">{formatCurrency(item.newPrice)}</TableCell>
                        <TableCell>
                          <div
                            className={`flex items-center space-x-1 ${
                              item.priceChange > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {item.priceChange > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                              {item.priceChange > 0 ? "+" : ""}
                              {formatCurrency(item.priceChange)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.percentageChange > 0
                                ? "text-green-600 border-green-200"
                                : "text-red-600 border-red-200"
                            }
                          >
                            {item.percentageChange > 0 ? "+" : ""}
                            {item.percentageChange.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatCurrency(Math.round(item.oldPricePerSqft))}
                        </TableCell>
                        <TableCell className="font-medium text-blue-600">
                          {formatCurrency(Math.round(item.newPricePerSqft))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Warning for large changes */}
          {Math.abs(averagePercentageChange) > 20 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Large Price Change Warning:</strong> The average price change is{" "}
                {averagePercentageChange.toFixed(1)}%. Please review carefully before proceeding.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4" />
            <span>All changes will be recorded in price history</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Apply Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
