"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, Download, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentPlanStep {
  srNo: number
  installmentDate: string
  milestone: string
  percentage: number
  amount: number
  vatAmount: number
  totalAmount: number
}

interface PaymentPlanGeneratorProps {
  isOpen: boolean
  onClose: () => void
  propertyPrice?: number
  propertyName?: string
}

export function PaymentPlanGenerator({
  isOpen,
  onClose,
  propertyPrice = 0,
  propertyName = "",
}: PaymentPlanGeneratorProps) {
  const [price, setPrice] = useState<number>(propertyPrice)
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanStep[]>([])
  const [isGenerated, setIsGenerated] = useState(false)

  // Default payment plan structure based on your example
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

  const generatePaymentPlan = () => {
    if (!price || price <= 0) return

    const bookingDate = new Date()
    const plan: PaymentPlanStep[] = []

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
      const vatAmount = 0 // As per your example, VAT is NA/0
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

    setPaymentPlan(plan)
    setIsGenerated(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getTotalAmount = () => {
    return paymentPlan.reduce((sum, step) => sum + step.totalAmount, 0)
  }

  const downloadPaymentPlan = () => {
    if (!isGenerated || paymentPlan.length === 0) return

    // Create CSV content
    const headers = [
      "Sr. No.",
      "Installment Date",
      "Milestone",
      "Percentage %",
      "Amount (AED)",
      "VAT Amount",
      "Incl. VAT (AED)",
    ]
    const csvContent = [
      `Payment Plan for ${propertyName || "Property"}`,
      `Total Property Price: ${formatCurrency(price)}`,
      `Generated on: ${new Date().toLocaleDateString()}`,
      "",
      headers.join(","),
      ...paymentPlan.map((step) =>
        [
          step.srNo,
          step.installmentDate,
          `"${step.milestone}"`,
          `${step.percentage}%`,
          step.amount.toFixed(2),
          step.vatAmount === 0 ? "NA" : step.vatAmount.toFixed(2),
          step.totalAmount.toFixed(2),
        ].join(","),
      ),
      "",
      `Total Amount: ${getTotalAmount().toFixed(2)}`,
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `payment-plan-${propertyName?.replace(/\s+/g, "-") || "property"}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClose = () => {
    onClose()
    setPaymentPlan([])
    setIsGenerated(false)
    if (!propertyPrice) {
      setPrice(0)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Payment Plan Generator
            {propertyName && <span className="text-sm font-normal text-gray-600">- {propertyName}</span>}
          </DialogTitle>
          <DialogDescription>
            Generate a detailed payment plan based on the property price with milestone-based installments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Property Price (AED)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number.parseFloat(e.target.value) || 0)}
                    placeholder="Enter property price"
                    className="text-lg font-medium"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={generatePaymentPlan} disabled={!price || price <= 0} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Generate Payment Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Plan Table */}
          {isGenerated && paymentPlan.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Payment Schedule</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={downloadPaymentPlan}>
                      <Download className="mr-2 h-4 w-4" />
                      Download CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Sr. No.</TableHead>
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
                          <TableCell className="font-medium">{step.srNo}</TableCell>
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
                        <TableCell className="text-right text-lg">{formatCurrency(getTotalAmount())}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600">Initial Payment (Booking + 30 days)</div>
                      <div className="text-xl font-bold text-blue-600">
                        {formatCurrency(paymentPlan.slice(0, 2).reduce((sum, step) => sum + step.totalAmount, 0))}
                      </div>
                      <div className="text-xs text-gray-500">20% of total price</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600">Construction Milestones</div>
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(paymentPlan.slice(4).reduce((sum, step) => sum + step.totalAmount, 0))}
                      </div>
                      <div className="text-xs text-gray-500">70% of total price</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600">Pre-Construction</div>
                      <div className="text-xl font-bold text-orange-600">
                        {formatCurrency(paymentPlan.slice(2, 4).reduce((sum, step) => sum + step.totalAmount, 0))}
                      </div>
                      <div className="text-xs text-gray-500">10% of total price</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Plan Structure Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Plan Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Early Payments (20%)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>On Booking</span>
                      <span className="font-medium">5%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Within 30 days</span>
                      <span className="font-medium">15%</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Pre-Construction (10%)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>6 Months from booking</span>
                      <span className="font-medium">5%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>12 Months from booking</span>
                      <span className="font-medium">5%</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Construction Milestones (70%)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>40% Complete (Dec 2026)</span>
                      <span className="font-medium">10%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>65% Complete (Mar 2027)</span>
                      <span className="font-medium">10%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>85% Complete (June 2028)</span>
                      <span className="font-medium">10%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>100% Complete (Dec 2028)</span>
                      <span className="font-medium">40%</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Key Features</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• No VAT on residential properties</li>
                    <li>• Milestone-based payments</li>
                    <li>• Flexible early payment structure</li>
                    <li>• Construction progress linked</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {isGenerated && (
            <Button onClick={downloadPaymentPlan}>
              <FileText className="mr-2 h-4 w-4" />
              Export Payment Plan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
