"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ensureDefaultData } from "@/utils/ensure-data"
import { useCurrency } from "@/contexts/currency-context"
import { getPropertyAnalytics } from "@/utils/analytics-utils"

export default function DashboardClient() {
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { formatPrice } = useCurrency()

  useEffect(() => {
    ensureDefaultData()
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const data = await getPropertyAnalytics()
      setAnalyticsData(data)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push("/dashboard/properties/add")}>Add Property</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="price-comparison">Price Comparison</TabsTrigger>
          <TabsTrigger value="property-units">Property Units</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData?.totalProperties || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analyticsData?.newPropertiesThisMonth || 0} since last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Units</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData?.availableUnits || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {analyticsData?.availablePercentage || 0}% of total inventory
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sold Units</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData?.soldUnits || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analyticsData?.soldUnitsThisMonth || 0} since last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales Value</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPrice ? formatPrice(analyticsData?.totalSalesValue || 0) : "0"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{formatPrice ? formatPrice(analyticsData?.salesValueThisMonth || 0) : "0"} this month
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={analyticsData?.salesOverview || []} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made {analyticsData?.recentSales?.length || 0} sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales data={analyticsData?.recentSales || []} formatPrice={formatPrice} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Analytics</CardTitle>
              <CardDescription>Detailed analysis of your property portfolio</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Price per Sqft</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatPrice ? formatPrice(analyticsData?.averagePricePerSqft || 0) : "0"}/sqft
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Most Popular Unit Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData?.mostPopularUnitType || "N/A"}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Days to Sell</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData?.averageDaysToSell || 0} days</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="price-comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Comparison</CardTitle>
              <CardDescription>Compare prices across different projects and unit types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Project</th>
                        <th className="h-10 px-4 text-left font-medium">Unit Type</th>
                        <th className="h-10 px-4 text-left font-medium">Avg. Price</th>
                        <th className="h-10 px-4 text-left font-medium">Avg. Price/sqft</th>
                        <th className="h-10 px-4 text-left font-medium">Min Price</th>
                        <th className="h-10 px-4 text-left font-medium">Max Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(analyticsData?.priceComparison || []).map((item: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td className="p-4">{item.project}</td>
                          <td className="p-4">{item.unitType}</td>
                          <td className="p-4">{formatPrice ? formatPrice(item.avgPrice) : item.avgPrice}</td>
                          <td className="p-4">
                            {formatPrice ? formatPrice(item.avgPricePerSqft) : item.avgPricePerSqft}/sqft
                          </td>
                          <td className="p-4">{formatPrice ? formatPrice(item.minPrice) : item.minPrice}</td>
                          <td className="p-4">{formatPrice ? formatPrice(item.maxPrice) : item.maxPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="property-units" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Units Overview</CardTitle>
              <CardDescription>Breakdown of units by type and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">Units by Type</h3>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-10 px-4 text-left font-medium">Unit Type</th>
                          <th className="h-10 px-4 text-left font-medium">Count</th>
                          <th className="h-10 px-4 text-left font-medium">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(analyticsData?.unitsByType || []).map((item: any, i: number) => (
                          <tr key={i} className="border-b">
                            <td className="p-4">{item.type}</td>
                            <td className="p-4">{item.count}</td>
                            <td className="p-4">{item.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Units by Status</h3>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-10 px-4 text-left font-medium">Status</th>
                          <th className="h-10 px-4 text-left font-medium">Count</th>
                          <th className="h-10 px-4 text-left font-medium">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(analyticsData?.unitsByStatus || []).map((item: any, i: number) => (
                          <tr key={i} className="border-b">
                            <td className="p-4">{item.status}</td>
                            <td className="p-4">{item.count}</td>
                            <td className="p-4">{item.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
