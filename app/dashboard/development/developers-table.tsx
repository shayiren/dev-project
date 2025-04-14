"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { EditDeveloperDialog } from "./edit-developer-dialog"
import { DeleteDeveloperDialog } from "./delete-developer-dialog"

interface Developer {
  id: string
  name: string
  description: string
  contactPerson: string
  phoneNumber: string
  email: string
  licenseNumber: string
  address: string
  logo: string
}

export function DevelopersTable() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editDeveloper, setEditDeveloper] = useState<Developer | null>(null)
  const [deleteDeveloper, setDeleteDeveloper] = useState<Developer | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadDevelopers()
  }, [])

  const loadDevelopers = () => {
    setIsLoading(true)
    try {
      const savedDevelopers = localStorage.getItem("realEstateDeveloperDetails")
      if (savedDevelopers) {
        const parsedDevelopers = JSON.parse(savedDevelopers)
        if (Array.isArray(parsedDevelopers)) {
          setDevelopers(parsedDevelopers)
        } else {
          setDevelopers([])
        }
      } else {
        setDevelopers([])
      }
    } catch (error) {
      console.error("Error loading developers:", error)
      setDevelopers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeveloperUpdated = () => {
    loadDevelopers()
  }

  // Don't render anything until we're on the client
  if (!isClient) {
    return <div>Loading developers...</div>
  }

  if (isLoading) {
    return <div>Loading developers...</div>
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Developer Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {developers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No developers found
              </TableCell>
            </TableRow>
          ) : (
            developers.map((developer) => (
              <TableRow key={developer.id}>
                <TableCell className="font-medium">{developer.name}</TableCell>
                <TableCell>{developer.contactPerson}</TableCell>
                <TableCell>{developer.email}</TableCell>
                <TableCell>{developer.phoneNumber}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditDeveloper(developer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteDeveloper(developer)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editDeveloper && (
        <EditDeveloperDialog
          developer={editDeveloper}
          open={!!editDeveloper}
          onOpenChange={(open) => {
            if (!open) setEditDeveloper(null)
          }}
          onDeveloperUpdated={handleDeveloperUpdated}
        />
      )}

      {deleteDeveloper && (
        <DeleteDeveloperDialog
          developer={deleteDeveloper}
          open={!!deleteDeveloper}
          onOpenChange={(open) => {
            if (!open) setDeleteDeveloper(null)
          }}
          onDeveloperDeleted={handleDeveloperUpdated}
        />
      )}
    </div>
  )
}
