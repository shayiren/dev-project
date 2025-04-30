import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface RecentSale {
  name: string
  email: string
  amount: number
  property: string
}

interface RecentSalesProps {
  data: RecentSale[]
  formatPrice?: (price: number) => string
}

export function RecentSales({ data, formatPrice }: RecentSalesProps) {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-8">
      {data.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitials(sale.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
            <p className="text-xs text-muted-foreground">{sale.property}</p>
          </div>
          <div className="ml-auto font-medium">
            {formatPrice ? formatPrice(sale.amount) : `$${sale.amount.toLocaleString()}`}
          </div>
        </div>
      ))}
    </div>
  )
}
