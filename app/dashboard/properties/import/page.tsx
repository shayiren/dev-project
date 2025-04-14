"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, FileSpreadsheet, Upload, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { addProperties } from "@/utils/storage-utils"

export default function ImportInventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const fileType = selectedFile.name.split(".").pop()?.toLowerCase()

      if (!["csv", "xls", "xlsx"].includes(fileType || "")) {
        toast({
          title: "Invalid file format",
          description: "Please upload a CSV or Excel file (.csv, .xls, .xlsx)",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      parseFile(selectedFile)
    }
  }

  const parseFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(10)

    try {
      // In a real app, you would use a library like papaparse for CSV or xlsx for Excel
      // For this demo, we'll simulate parsing with a timeout and sample data

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUploadProgress(50)

      // Sample preview data
      const sampleData = [
        {
          id: "PROP101",
          title: "Luxury Apartment 101",
          projectName: "Azure Towers",
          developerName: "Coastal Developments Inc.",
          location: "Miami Beach, FL",
          price: 750000,
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          internalArea: 950,
          externalArea: 250,
          type: "Apartment",
          status: "Available",
        },
        {
          id: "PROP102",
          title: "Penthouse Suite 501",
          projectName: "Sunset Heights",
          developerName: "Premium Estates Group",
          location: "Los Angeles, CA",
          price: 1250000,
          bedrooms: 3,
          bathrooms: 3.5,
          area: 2100,
          internalArea: 1800,
          externalArea: 300,
          type: "Penthouse",
          status: "Available",
        },
        {
          id: "PROP103",
          title: "Garden Villa 12",
          projectName: "Alpine Estates",
          developerName: "Summit Properties",
          location: "Aspen, CO",
          price: 950000,
          bedrooms: 4,
          bathrooms: 3,
          area: 2200,
          internalArea: 1900,
          externalArea: 300,
          type: "Villa",
          status: "Developer Hold",
        },
      ]

      setPreviewData(sampleData)

      // Validate data
      const validationErrors = validateData(sampleData)
      setErrors(validationErrors)

      setUploadProgress(100)
    } catch (error) {
      console.error("Error parsing file:", error)
      toast({
        title: "Error parsing file",
        description: "There was a problem reading your file. Please check the format and try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const validateData = (data: any[]): string[] => {
    const errors: string[] = []

    // Check if data is empty
    if (data.length === 0) {
      errors.push("The file contains no data")
      return errors
    }

    // Check for required fields
    data.forEach((row, index) => {
      const rowNum = index + 1
      if (!row.title) errors.push(`Row ${rowNum}: Missing title`)
      if (!row.projectName) errors.push(`Row ${rowNum}: Missing project name`)
      if (!row.location) errors.push(`Row ${rowNum}: Missing location`)
      if (!row.price) errors.push(`Row ${rowNum}: Missing price`)
      if (!row.area) errors.push(`Row ${rowNum}: Missing area`)
    })

    return errors
  }

  const handleImport = async () => {
    if (errors.length > 0) {
      toast({
        title: "Validation errors",
        description: "Please fix the errors before importing",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Process preview data to match property structure
      const newProperties = previewData.map((item) => {
        // Generate a unique ID if not provided
        const id =
          item.id ||
          `PROP${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(3, "0")}`

        // Calculate derived values if not provided
        const internalArea = item.internalArea || Math.round(item.area * 0.8)
        const externalArea = item.externalArea || item.area - internalArea
        const internalPricePerSqft = item.internalPricePerSqft || Math.round((item.price * 0.8) / internalArea)
        const externalPricePerSqft = item.externalPricePerSqft || Math.round((item.price * 0.2) / externalArea)
        const totalPricePerSqft = item.totalPricePerSqft || Math.round(item.price / item.area)

        return {
          id,
          title: item.title,
          projectName: item.projectName,
          developerName: item.developerName,
          location: item.location,
          price: Number(item.price),
          status: item.status || "Available",
          bedrooms: Number(item.bedrooms) || 0,
          bathrooms: Number(item.bathrooms) || 0,
          area: Number(item.area),
          internalArea,
          externalArea,
          internalPricePerSqft,
          externalPricePerSqft,
          totalPricePerSqft,
          views: item.views || "",
          floorPlate: item.floorPlate || "",
          type: item.type || "Apartment",
          floorPlan: item.floorPlan || "/placeholder.svg?height=400&width=600",
          imageUrl: item.imageUrl || "/placeholder.svg?height=400&width=600",
          createdAt: new Date().toISOString().split("T")[0],
        }
      })

      // Add properties using our utility function
      const success = addProperties(newProperties)

      if (!success) {
        throw new Error("Failed to save properties to storage")
      }

      // Show success message
      toast({
        title: "Import successful",
        description: `${newProperties.length} units have been imported successfully.`,
      })

      // Redirect back to properties page
      router.push("/dashboard/properties")
    } catch (error) {
      console.error("Error importing data:", error)
      toast({
        title: "Import failed",
        description: "There was a problem importing your data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setFile(null)
    setPreviewData([])
    setErrors([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Import Inventory</h1>
        <p className="text-muted-foreground">Upload a CSV or Excel file to import multiple units at once</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>Select a CSV or Excel file containing your inventory data</CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Drag and drop your file here</p>
              <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileChange}
                className="max-w-sm"
              />
              <p className="text-xs text-muted-foreground mt-4">Supported formats: CSV (.csv), Excel (.xls, .xlsx)</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Validation Errors</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 text-sm">
                      {errors.slice(0, 5).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {errors.length > 5 && <li>...and {errors.length - 5} more errors</li>}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {previewData.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Preview</h3>
                  <div className="border rounded-md overflow-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Developer</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>Bedrooms</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.id || "Auto-generated"}</TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.projectName}</TableCell>
                            <TableCell>{item.developerName}</TableCell>
                            <TableCell>${Number(item.price).toLocaleString()}</TableCell>
                            <TableCell>{item.area} sqft</TableCell>
                            <TableCell>{item.bedrooms}</TableCell>
                            <TableCell>{item.status || "Available"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isUploading || errors.length > 0 || previewData.length === 0}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import {previewData.length > 0 ? `${previewData.length} Units` : ""}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">File Format Guidelines</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4">Your CSV or Excel file should include the following columns:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Required Fields:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>title - Unit title</li>
                  <li>projectName - Project name</li>
                  <li>location - Location</li>
                  <li>price - Price (numeric)</li>
                  <li>area - Total area in sqft (numeric)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Optional Fields:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>id - Unit ID (auto-generated if not provided)</li>
                  <li>developerName - Developer name (auto-filled from project if not provided)</li>
                  <li>bedrooms - Number of bedrooms</li>
                  <li>bathrooms - Number of bathrooms</li>
                  <li>type - Unit type (Apartment, Condo, etc.)</li>
                  <li>status - Unit status (Active, Pending, etc.)</li>
                  <li>internalArea - Internal area in sqft</li>
                  <li>externalArea - External area in sqft</li>
                  <li>views - View type</li>
                  <li>floorPlate - Floor plate</li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Sample CSV Format:</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                title,projectName,developerName,location,price,area,bedrooms,bathrooms,type,status
                <br />
                "Luxury Apartment 101","Azure Towers","Coastal Developments Inc.","Miami Beach,
                FL",750000,1200,2,2,"Apartment","Active"
                <br />
                "Penthouse Suite 501","Sunset Heights","Premium Estates Group","Los Angeles,
                CA",1250000,2100,3,3.5,"Penthouse","Active"
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
