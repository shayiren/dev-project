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
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Printer, Download } from "lucide-react"

interface Property {
  id: number
  unitNumber: string
  projectName: string
  towerName: string
  type: string
  bedrooms: number
  totalArea: number
  price: number
  status: string
  phase: string
}

interface PaymentPlanStep {
  srNo: number
  installmentDate: string
  milestone: string
  percentage: number
  amount: number
  vatAmount: number
  totalAmount: number
}

interface SalesOfferPreviewProps {
  isOpen: boolean
  onClose: () => void
  property: Property | null
}

export function SalesOfferPreview({ isOpen, onClose, property }: SalesOfferPreviewProps) {
  if (!property) return null

  // Generate payment plan for the property
  const generatePaymentPlan = (price: number): PaymentPlanStep[] => {
    const bookingDate = new Date()
    const plan: PaymentPlanStep[] = []

    const defaultPlanStructure = [
      { milestone: "On Booking", percentage: 5, dateOffset: 0, dateType: "booking" },
      { milestone: "Within 30 days of booking", percentage: 15, dateOffset: 30, dateType: "days" },
      { milestone: "6 Months from booking", percentage: 5, dateOffset: 6, dateType: "months" },
      { milestone: "12 Months from booking", percentage: 5, dateOffset: 12, dateType: "months" },
      {
        milestone: "40% Construction Complete",
        percentage: 10,
        dateOffset: 0,
        dateType: "milestone",
        targetDate: "Dec 2026",
      },
      {
        milestone: "65% Construction Complete",
        percentage: 10,
        dateOffset: 0,
        dateType: "milestone",
        targetDate: "Mar 2027",
      },
      {
        milestone: "85% Construction Complete",
        percentage: 10,
        dateOffset: 0,
        dateType: "milestone",
        targetDate: "June 2028",
      },
      {
        milestone: "100% Construction Complete",
        percentage: 40,
        dateOffset: 0,
        dateType: "milestone",
        targetDate: "Dec 2028",
      },
    ]

    defaultPlanStructure.forEach((step, index) => {
      let installmentDate = ""

      if (step.dateType === "booking") {
        installmentDate = bookingDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      } else if (step.dateType === "days") {
        const date = new Date(bookingDate)
        date.setDate(date.getDate() + step.dateOffset)
        installmentDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      } else if (step.dateType === "months") {
        const date = new Date(bookingDate)
        date.setMonth(date.getMonth() + step.dateOffset)
        installmentDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      } else if (step.dateType === "milestone") {
        installmentDate = step.targetDate || "TBD"
      }

      const amount = Math.round((price * step.percentage) / 100)
      const vatAmount = 0
      const totalAmount = amount + vatAmount

      plan.push({
        srNo: index + 1,
        installmentDate,
        milestone: step.milestone,
        percentage: step.percentage,
        amount,
        vatAmount,
        totalAmount,
      })
    })

    return plan
  }

  const paymentPlan = generatePaymentPlan(property.price)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatArea = (area: number) => {
    return new Intl.NumberFormat("en-AE", { maximumFractionDigits: 2 }).format(area)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // This would trigger browser's print dialog with save as PDF option
    window.print()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible">
        <DialogHeader className="print:hidden">
          <DialogTitle>Sales Offer Preview</DialogTitle>
          <DialogDescription>Preview of the sales offer for {property.unitNumber}</DialogDescription>
        </DialogHeader>

        {/* Sales Offer Content */}
        <div className="sales-offer-content print:text-black print:bg-white">
          {/* Page 1 */}
          <div className="page-1 mb-8 print:mb-0 print:page-break-after-always">
            {/* Banner Image Placeholder */}
            <div className="w-full h-48 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg mb-6 flex items-center justify-center print:rounded-none print:h-32">
              <div className="text-white text-center">
                <h1 className="text-3xl font-bold mb-2">Fairmont Residences</h1>
                <p className="text-xl">Al Marjan Island</p>
              </div>
            </div>

            {/* Sales Offer Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">SALES OFFER</h1>
            </div>

            {/* Introduction */}
            <div className="mb-8 space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                <strong>Dear Customer,</strong>
              </p>
              <p>
                Thank you for your interest in Ardee. In partnership with Fairmont Residences Al Marjan Island, we are
                delivering a new standard in coastal living, combining modern design with Fairmont's established
                reputation.
              </p>
              <p>
                Fairmont Residences Al Marjan Island offers a private beachfront setting with world-class amenities. The
                following properties have been carefully selected to align with your requirements.
              </p>
            </div>

            {/* Property Table */}
            <Card className="print:shadow-none print:border print:border-gray-300">
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Sr.</TableHead>
                      <TableHead className="text-center">Unit No.</TableHead>
                      <TableHead className="text-center">Property Type</TableHead>
                      <TableHead className="text-center">Number of Bedroom</TableHead>
                      <TableHead className="text-center">Built Up Area</TableHead>
                      <TableHead className="text-center">Purchase Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-center font-medium">1</TableCell>
                      <TableCell className="text-center font-medium">{property.unitNumber}</TableCell>
                      <TableCell className="text-center">{property.type}</TableCell>
                      <TableCell className="text-center">{property.bedrooms}</TableCell>
                      <TableCell className="text-center">{formatArea(property.totalArea)}</TableCell>
                      <TableCell className="text-center font-bold">{formatCurrency(property.price)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={5} className="text-right font-bold">
                        Total
                      </TableCell>
                      <TableCell className="text-center font-bold text-lg">{formatCurrency(property.price)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Page 2 */}
          <div className="page-2 mb-8 print:mb-0 print:page-break-after-always">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Property Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card className="print:shadow-none print:border print:border-gray-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Project Name:</span>
                      <span className="font-semibold">Fairmont Residences Al Marjan Island</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Tower Name:</span>
                      <span className="font-semibold">{property.towerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Property Status:</span>
                      <span className="font-semibold">Off-plan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Estimated Completion:</span>
                      <span className="font-semibold">Q4 2028</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="print:shadow-none print:border print:border-gray-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Financial Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Purchase Price (AED):</span>
                      <span className="font-bold text-lg text-green-600">{formatCurrency(property.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Built Up Area:</span>
                      <span className="font-semibold">{formatArea(property.totalArea)} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Price per sq ft:</span>
                      <span className="font-semibold">
                        {formatCurrency(Math.round(property.price / property.totalArea))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Plan */}
            <Card className="print:shadow-none print:border print:border-gray-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Plan</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Sr. No.</TableHead>
                      <TableHead>Installment Date</TableHead>
                      <TableHead>Milestone</TableHead>
                      <TableHead className="text-center">Percentage %</TableHead>
                      <TableHead className="text-right">Amount (AED)</TableHead>
                      <TableHead className="text-right">VAT Amount</TableHead>
                      <TableHead className="text-right">Incl. VAT (AED)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentPlan.map((step) => (
                      <TableRow key={step.srNo}>
                        <TableCell className="text-center font-medium">{step.srNo}</TableCell>
                        <TableCell>{step.installmentDate}</TableCell>
                        <TableCell>{step.milestone}</TableCell>
                        <TableCell className="text-center">{step.percentage}%</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(step.amount)}</TableCell>
                        <TableCell className="text-right">
                          {step.vatAmount === 0 ? "NA" : formatCurrency(step.vatAmount)}
                        </TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(step.totalAmount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-gray-50 font-bold">
                      <TableCell colSpan={6} className="text-right">
                        Total Amount:
                      </TableCell>
                      <TableCell className="text-right text-lg">
                        {formatCurrency(paymentPlan.reduce((sum, step) => sum + step.totalAmount, 0))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Page 3 */}
          <div className="page-3 print:mb-0">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Floor Plan</h2>

            {/* Floor Plan Placeholder */}
            <Card className="mb-8 print:shadow-none print:border print:border-gray-300">
              <CardContent className="p-6">
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className="text-xl font-semibold mb-2">Floor Plan</h3>
                    <p>Unit {property.unitNumber}</p>
                    <p>
                      {property.type} - {property.bedrooms} Bedroom
                    </p>
                    <p>{formatArea(property.totalArea)} sq ft</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Conditions */}
            <Card className="print:shadow-none print:border print:border-gray-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Terms & Conditions</h3>
                <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                  <p>
                    <strong>Disclaimer:</strong> All fees are subject to change without prior notice, in accordance with
                    directives from the relevant authorities.
                  </p>
                  <p>
                    The sales offer is valid for <strong>1 (one) day</strong> from the issuance date and is subject to
                    withdrawal or modification without notice.
                  </p>
                  <p>
                    This sales offer is prepared based on the information available at the time of preparation and is
                    subject to final approval from the developer.
                  </p>
                  <p>
                    All measurements and areas are approximate and may vary from the actual measurements upon completion
                    of the project.
                  </p>
                  <p>
                    The developer reserves the right to make changes to the specifications, designs, and layouts without
                    prior notice.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-300 text-center text-sm text-gray-600">
              <p>
                <strong>Fairmont Residences Al Marjan Island</strong>
              </p>
              <p>Al Marjan Island, Ras Al Khaimah, UAE</p>
              <p>Generated on: {new Date().toLocaleDateString("en-GB")}</p>
              <p className="mt-2 text-xs">
                This document is confidential and proprietary. Any reproduction or distribution without written consent
                is prohibited.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="print:hidden">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Save as PDF
          </Button>
        </DialogFooter>
      </DialogContent>

      <style jsx global>{`
        @media print {
          .sales-offer-content {
            font-size: 12px;
          }
          .page-break-after-always {
            page-break-after: always;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
          .print\\:max-h-none {
            max-height: none !important;
          }
          .print\\:overflow-visible {
            overflow: visible !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border {
            border: 1px solid #d1d5db !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:h-32 {
            height: 8rem !important;
          }
          .print\\:mb-0 {
            margin-bottom: 0 !important;
          }
          .print\\:page-break-after-always {
            page-break-after: always !important;
          }
        }
      `}</style>
    </Dialog>
  )
}
