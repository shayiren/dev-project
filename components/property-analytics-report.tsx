"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react"
import { getPropertyStatusCounts, getMonthlyData, calculateMonthlyGrowth } from "@/utils/analytics-utils"
import { getAllProperties } from "@/utils/storage-utils"

export function PropertyAnalyticsReport() {
  const [properties, setProperties] = useState<any[]>([])
  const [statusCounts, setStatusCounts] = useState<any>({})
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [monthlyGrowth, setMonthlyGrowth] = useState<{ percentage: string; isPositive: boolean }>({
    percentage: "0",
    isPositive: true,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true)
        const allProperties = getAllProperties()
        setProperties(allProperties)

        // Calculate analytics data
        const counts = getPropertyStatusCounts(allProperties)
        setStatusCounts(counts)

        const monthly = getMonthlyData(allProperties)
        setMonthlyData(monthly)

        const growth = calculateMonthlyGrowth(monthly)
        setMonthlyGrowth(growth)
      } catch (error) {
        console.error("Error loading analytics data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Prepare data for status chart
  const statusChartData = [
    { name: "Available", value: statusCounts.Available || 0, fill: "#10b981" },
    { name: "Reserved", value: statusCounts.Reserved || 0, fill: "#f59e0b" },
    { name: "Under Offer", value: statusCounts["Under Offer"] || 0, fill: "#3b82f6" },
    { name: "Sold", value: statusCounts.Sold || 0, fill: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.Total || 0}</div>
            <p className="text-xs text-muted-foreground">All properties in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.Reserved || 0}</div>
            <p className="text-xs text-muted-foreground">
              {(((statusCounts.Reserved || 0) / (statusCounts.Total || 1)) * 100).toFixed(1)}% of total inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts["Under Offer"] || 0}</div>
            <p className="text-xs text-muted-foreground">
              {(((statusCounts["Under Offer"] || 0) / (statusCounts.Total || 1)) * 100).toFixed(1)}% of total inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{monthlyGrowth.percentage}%</div>
              {monthlyGrowth.isPositive ? (
                <ArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="ml-2 h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">Compared to last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
          <TabsTrigger value="comparison">Month-on-Month Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Status Distribution</CardTitle>
              <CardDescription>Breakdown of properties by current status</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" nameKey="name" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Report</CardTitle>
              <CardDescription>Properties sold and reserved over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="sold" name="Sold" fill="#ef4444" />
                    <Bar dataKey="reserved" name="Reserved" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Month-on-Month Comparison</CardTitle>
              <CardDescription>Trend of total transactions over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total Transactions"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center">
                {monthlyGrowth.isPositive ? (
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    <span className="font-medium">{monthlyGrowth.percentage}% increase from previous month</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <TrendingDown className="mr-2 h-5 w-5" />
                    <span className="font-medium">{monthlyGrowth.percentage}% decrease from previous month</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
