import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle } from "lucide-react"

const agencies = [
  {
    id: 1,
    name: "Dubai Homes Real Estate",
    contact: "John Smith",
    email: "john@dubaihomes.com",
    phone: "+971 50 123 4567",
    status: "Active",
  },
  {
    id: 2,
    name: "RAK Properties",
    contact: "Sarah Johnson",
    email: "sarah@rakproperties.com",
    phone: "+971 50 987 6543",
    status: "Active",
  },
  {
    id: 3,
    name: "Luxury Estates Dubai",
    contact: "Michael Brown",
    email: "michael@luxuryestates.com",
    phone: "+971 50 456 7890",
    status: "Pending Verification",
  },
]

export default function AgenciesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Agency Management</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Agency
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agencies.map((agency) => (
            <TableRow key={agency.id}>
              <TableCell className="font-medium">{agency.name}</TableCell>
              <TableCell>{agency.contact}</TableCell>
              <TableCell>{agency.email}</TableCell>
              <TableCell>{agency.phone}</TableCell>
              <TableCell>{agency.status}</TableCell>
              <TableCell>
                <Button variant="ghost">View</Button>
                <Button variant="ghost">Edit</Button>
                <Button variant="ghost" className="text-red-500">
                  Deactivate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
