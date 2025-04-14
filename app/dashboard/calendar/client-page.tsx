"use client"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

// Create a simple currency formatter that doesn't rely on context
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export default function CalendarClientPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Events for {date?.toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="font-medium">Property Viewing</h3>
                <p className="text-sm text-muted-foreground">10:00 AM - 11:00 AM</p>
                <p className="text-sm">Client: John Smith</p>
                <p className="text-sm">Property: Luxury Villa</p>
                <p className="text-sm">Price: {formatCurrency(750000)}</p>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="font-medium">Contract Signing</h3>
                <p className="text-sm text-muted-foreground">2:00 PM - 3:00 PM</p>
                <p className="text-sm">Client: Sarah Johnson</p>
                <p className="text-sm">Property: Downtown Apartment</p>
                <p className="text-sm">Price: {formatCurrency(450000)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
