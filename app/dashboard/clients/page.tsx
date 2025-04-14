"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

type Client = {
  id: string
  name: string
  email: string
  phone: string
  status: string
  properties: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "client1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(123) 456-7890",
      status: "Active",
      properties: 2,
    },
    {
      id: "client2",
      name: "Sarah Miller",
      email: "sarah.miller@example.com",
      phone: "(234) 567-8901",
      status: "Active",
      properties: 1,
    },
    {
      id: "client3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "(345) 678-9012",
      status: "Inactive",
      properties: 0,
    },
    {
      id: "client4",
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      phone: "(456) 789-0123",
      status: "Active",
      properties: 3,
    },
    {
      id: "client5",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "(567) 890-1234",
      status: "Active",
      properties: 1,
    },
  ])

  // Load clients from localStorage on initial render
  useEffect(() => {
    try {
      const savedClients = localStorage.getItem("realEstateClients")
      if (savedClients) {
        const parsedClients = JSON.parse(savedClients)
        if (Array.isArray(parsedClients) && parsedClients.length > 0) {
          // Format clients for display
          const formattedClients = parsedClients.map((client: any) => ({
            id: client.id,
            name: `${client.firstName} ${client.lastName}`,
            email: client.email || "",
            phone: client.phoneNumber || "",
            status: client.status || "Active",
            properties: client.properties || 0,
          }))
          setClients(formattedClients)
        }
      }
    } catch (error) {
      console.error("Error loading clients:", error)
    }
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/clients/add">
            <Button>Add Client</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>View and manage your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No clients found. Add your first client.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          client.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell>{client.properties}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/clients/${client.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
