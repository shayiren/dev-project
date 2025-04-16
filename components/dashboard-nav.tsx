import Link from "next/link"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Properties", href: "/dashboard/properties" },
  { name: "Clients", href: "/dashboard/clients" },
  { name: "Development", href: "/dashboard/development" },
  { name: "Sold", href: "/dashboard/sold" },
  { name: "Analytics", href: "/dashboard/analytics" },
  { name: "Calendar", href: "/dashboard/calendar" },
  { name: "Messages", href: "/dashboard/messages" },
  { name: "Settings", href: "/dashboard/settings" },
]

export function DashboardNav() {
  return (
    <nav className="grid items-start gap-2">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}
