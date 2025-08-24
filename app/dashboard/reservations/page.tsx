import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle } from "lucide-react"

const reservations = [
  {
    id: 1,
    property: "Luxury Villa",
    client: "Emma Watson",
    agent: "David Miller",
    date: "2023-07-01",
    status: "Confirmed",
  },
  {
    id: 2,
    property: "Modern Apartment",
    client: "Tom Hardy",
    agent: "Sarah Johnson",
    date: "2023-07-05",
    status: "Pending",
  },
  {
    id: 3,
    property: "Beachfront Villa",
    client: "Chris Hemsworth",
    agent: "Michael Brown",
    date: "2023-07-10",
    status: "Cancelled",
  },
]

export default function ReservationsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Reservations Management</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Reservation
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">{reservation.property}</TableCell>
              <TableCell>{reservation.client}</TableCell>
              <TableCell>{reservation.agent}</TableCell>
              <TableCell>{reservation.date}</TableCell>
              <TableCell>{reservation.status}</TableCell>
              <TableCell>
                <Button variant="ghost">View</Button>
                <Button variant="ghost">Edit</Button>
                <Button variant="ghost" className="text-red-500">
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
