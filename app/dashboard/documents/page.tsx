import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Eye, Trash2 } from "lucide-react"

export default function DocumentsPage() {
  // Sample documents data
  const documents = [
    {
      id: "doc1",
      name: "Purchase Agreement - 123 Main St",
      type: "PDF",
      size: "2.4 MB",
      createdAt: "2023-05-15",
      status: "Signed",
    },
    {
      id: "doc2",
      name: "Listing Contract - 456 Oak Ave",
      type: "PDF",
      size: "1.8 MB",
      createdAt: "2023-06-02",
      status: "Pending",
    },
    {
      id: "doc3",
      name: "Property Disclosure - 789 Pine Rd",
      type: "PDF",
      size: "3.2 MB",
      createdAt: "2023-06-10",
      status: "Signed",
    },
    {
      id: "doc4",
      name: "Inspection Report - 101 Cedar Ln",
      type: "PDF",
      size: "5.7 MB",
      createdAt: "2023-06-15",
      status: "Completed",
    },
    {
      id: "doc5",
      name: "Closing Statement - 202 Maple Dr",
      type: "PDF",
      size: "1.5 MB",
      createdAt: "2023-06-20",
      status: "Signed",
    },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage your real estate documents</p>
        </div>
        <Button>Upload Document</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>View and manage your real estate documents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>{doc.createdAt}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === "Signed"
                          ? "bg-green-100 text-green-800"
                          : doc.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
