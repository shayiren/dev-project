"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import Image from "next/image"

interface SalesOfferPreviewProps {
  property: any
  paymentPlan: any
}

export function SalesOfferPreview({ property, paymentPlan }: SalesOfferPreviewProps) {
  const currentDate = format(new Date(), "yyyy-MM-dd HH:mm:ss")

  // Calculate payment amounts based on percentages
  const calculatePaymentAmount = (percentage: number) => {
    return Math.round(property.price * (percentage / 100))
  }

  return (
    <Card className="print:shadow-none print:border-none sales-offer-page">
      <CardHeader className="pb-2 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle className="text-2xl font-bold">SALES OFFER</CardTitle>
            <Badge className="mt-2 text-lg bg-primary">UNIT {property.unitNumber}</Badge>
          </div>
          {property.projectName && (
            <div className="text-right mt-4 md:mt-0">
              <h3 className="text-xl font-semibold">{property.projectName}</h3>
              {property.buildingName && <p className="text-muted-foreground">{property.buildingName}</p>}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Unit Details */}
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead>Bedroom</TableHead>
                <TableHead>Internal Area</TableHead>
                <TableHead>External Area</TableHead>
                <TableHead>Total Area</TableHead>
                <TableHead>Unit Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{property.unitNumber}</TableCell>
                <TableCell>{property.bedrooms}BR</TableCell>
                <TableCell>{property.internalArea?.toFixed(2) || "-"} Sq. Ft.</TableCell>
                <TableCell>{property.externalArea?.toFixed(2) || "-"} Sq. Ft.</TableCell>
                <TableCell>{property.totalArea?.toFixed(2) || property.area?.toFixed(2) || "-"} Sq. Ft.</TableCell>
                <TableCell className="font-bold">{property.price?.toLocaleString()} AED</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p className="text-sm text-muted-foreground italic mt-2">
            Disclaimer: This offer is subject to availability and/or subject to change without notice.
          </p>
          <p className="text-sm text-muted-foreground italic">Issued On: {currentDate}</p>
        </div>

        {/* Floor Plan */}
        {property.floorPlan && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Floor Plan</h3>
            <div className="flex justify-center">
              <div className="relative h-[300px] w-full max-w-[500px]">
                <Image
                  src={property.floorPlan || "/placeholder.svg"}
                  alt="Floor Plan"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment Plan */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">PAYMENT PLAN</h3>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Installments</TableHead>
                <TableHead>Payment Milestone</TableHead>
                <TableHead>Payment(%)</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentPlan.installments.map((installment: any, index: number) => {
                const amount = calculatePaymentAmount(installment.percentage)
                return (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                    <TableCell>{installment.name}</TableCell>
                    <TableCell>{installment.milestone}</TableCell>
                    <TableCell>{installment.percentage}%</TableCell>
                    <TableCell>{amount.toLocaleString()}</TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="font-bold">
                <TableCell colSpan={3} className="text-right">
                  Total
                </TableCell>
                <TableCell>{property.price?.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>* RAK Municipality / Other Administration Fees - AED 5000.</p>
            <p>* RAK Municipality / RERA Registration Fees - As per authorities</p>
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground italic">
              Disclaimer: This offer is subject to availability and/or subject to change without notice.
            </p>
            <p className="text-sm text-muted-foreground italic">Issued On: {currentDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
