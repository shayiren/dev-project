import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-[100px]" />
                </CardTitle>
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-1" />
                <Skeleton className="h-3 w-[140px]" />
              </CardContent>
            </Card>
          ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              <Skeleton className="h-5 w-[200px]" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-[300px] mt-1" />
            </CardDescription>
          </div>
          <Skeleton className="h-9 w-[100px]" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-10 w-[150px]" />
                <Skeleton className="h-10 w-[150px]" />
              </div>
            </div>

            <div className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="p-0">
                        <Skeleton className="aspect-video w-full" />
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-[200px]" />
                          <Skeleton className="h-4 w-[180px]" />
                          <Skeleton className="h-4 w-[150px]" />
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-[100px]" />
                            <Skeleton className="h-4 w-[80px]" />
                          </div>
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-4 w-[50px]" />
                            <Skeleton className="h-4 w-[50px]" />
                            <Skeleton className="h-4 w-[80px]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
