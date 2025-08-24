import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle } from "lucide-react"

const sales = [
  {
    id: 1,
    property: "Luxury Villa",
    client: "John Doe",
    agent: "Alice Smith",
    price: "AED 18,365,000",
    date: "2023-06-15",
    status: "Completed",
  },
  {
    id: 2,
    property: "Modern Apartment",
    client: "Jane Smith",
    agent: "Bob Johnson",
    price: "AED 800,000",
    date: "2023-06-10",
    status: "Pending",
  },
  {
    id: 3,
    property: "Commercial Space",
    client: "Acme Corp",
    agent: "Charlie Brown",
    price: "AED 2,500,000",
    date: "2023-06-05",
    status: "In Progress",
  },
]

export default function SalesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Sales Management</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Sale
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.property}</TableCell>
              <TableCell>{sale.client}</TableCell>
              <TableCell>{sale.agent}</TableCell>
              <TableCell>{sale.price}</TableCell>
              <TableCell>{sale.date}</TableCell>
              <TableCell>{sale.status}</TableCell>
              <TableCell>
                <Button variant="ghost">View</Button>
                <Button variant="ghost">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
