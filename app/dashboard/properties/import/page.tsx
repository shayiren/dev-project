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
    setErrors([])

    try {
      const fileType = file.name.split(".").pop()?.toLowerCase()
      let parsedData: any[] = []

      if (fileType === "csv") {
        // Parse CSV file
        parsedData = await parseCSV(file)
      } else if (["xls", "xlsx"].includes(fileType || "")) {
        // Parse Excel file
        parsedData = await parseExcel(file)
      }

      setUploadProgress(70)

      // Validate the parsed data
      const validationErrors = validateData(parsedData)
      setErrors(validationErrors)

      // Set the preview data
      setPreviewData(parsedData)
      setUploadProgress(100)
    } catch (error) {
      console.error("Error parsing file:", error)
      toast({
        title: "Error parsing file",
        description: "There was a problem reading your file. Please check the format and try again.",
        variant: "destructive",
      })
      setErrors(["Failed to parse file. Please check the format and try again."])
    } finally {
      setIsUploading(false)
    }
  }

  const parseCSV = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const csv = event.target?.result as string
          if (!csv) {
            reject(new Error("Failed to read file"))
            return
          }

          // Simple CSV parser
          const lines = csv.split("\n")
          const headers = lines[0].split(",").map(
            (header) => header.trim().replace(/^"(.*)"$/, "$1"), // Remove quotes if present
          )

          const results = []

          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue // Skip empty lines

            const values = lines[i].split(",").map(
              (value) => value.trim().replace(/^"(.*)"$/, "$1"), // Remove quotes if present
            )

            if (values.length !== headers.length) {
              // Skip malformed lines
              continue
            }

            const row: Record<string, any> = {}
            headers.forEach((header, index) => {
              // Convert numeric values
              const value = values[index]
              if (!isNaN(Number(value)) && value !== "") {
                row[header] = Number(value)
              } else {
                row[header] = value
              }
            })

            results.push(row)
          }

          resolve(results)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  const parseExcel = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          // For Excel files, we'll use a simplified approach
          // In a real app, you would use a library like xlsx
          // This is a placeholder that simulates Excel parsing

          // Simulate parsing delay
          setTimeout(() => {
            // Create sample data based on the file name to simulate parsing
            const fileName = file.name.toLowerCase()
            const sampleSize = Math.floor(Math.random() * 10) + 5 // 5-15 items

            const results = []
            for (let i = 0; i < sampleSize; i++) {
              results.push({
                id: `PROP${1000 + i}`,
                title: `Property from ${fileName} - ${i + 1}`,
                projectName: fileName.includes("project") ? "Sample Project" : "New Development",
                developerName: "Excel Import Developer",
                location: "Imported Location",
                price: 500000 + i * 50000,
                bedrooms: Math.floor(Math.random() * 4) + 1,
                bathrooms: Math.floor(Math.random() * 3) + 1,
                area: 1000 + i * 100,
                type: ["Apartment", "Villa", "Townhouse"][i % 3],
                status: "Available",
              })
            }

            resolve(results)
          }, 1000)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsArrayBuffer(file)
    })
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
      if (!row.unit && !row.unitNumber) errors.push(`Row ${rowNum}: Missing unit number`)
      if (!row.project && !row.projectName) errors.push(`Row ${rowNum}: Missing project name`)
      if (!row.price) errors.push(`Row ${rowNum}: Missing price`)
      if (!row.area) errors.push(`Row ${rowNum}: Missing area`)
      if (!row.type) errors.push(`Row ${rowNum}: Missing type`)
    })

    // Check for required client details based on status
    data.forEach((row, index) => {
      const rowNum = index + 1
      if (["Reserved", "Under Offer", "Sold"].includes(row.status)) {
        if (!row.clientName) errors.push(`Row ${rowNum}: Missing client name for ${row.status} property`)
        if (!row.clientEmail) errors.push(`Row ${rowNum}: Missing client email for ${row.status} property`)
        if (!row.agentName) errors.push(`Row ${rowNum}: Missing agent name for ${row.status} property`)
      }
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
        const area = Number(item.area) || 0
        const internalArea = item.internalArea || Math.round(area * 0.8)
        const externalArea = item.externalArea || area - internalArea
        const price = Number(item.price) || 0
        const pricePerSqft = item.pricePerSqft || (area > 0 ? Math.round(price / area) : 0)

        return {
          id,
          unitNumber: item.unit || item.unitNumber || `Unit-${id}`,
          projectName: item.project || item.projectName || "Unknown Project",
          phase: item.phase || "",
          buildingName: item.building || "",
          floorNumber: item.floor || 0,
          type: item.type || "Apartment",
          bedrooms: Number(item.beds || item.bedrooms) || 0,
          bathrooms: Number(item.bathrooms) || 0,
          area: area,
          internalArea,
          externalArea,
          totalPricePerSqft: pricePerSqft,
          internalPricePerSqft: item.internalPricePerSqft || Math.round(pricePerSqft * 1.1),
          externalPricePerSqft: item.externalPricePerSqft || Math.round(pricePerSqft * 0.9),
          price: price,
          status: item.status || "Available",
          views: item.views || "",
          developerName: item.developer || item.developerName || "Unknown Developer",
          location: item.location || "Unknown Location",
          floorPlan: item.floorPlan || "/placeholder.svg?height=400&width=600",
          imageUrl: item.imageUrl || "/placeholder.svg?height=400&width=600",
          createdAt: new Date().toISOString().split("T")[0],
          // Add client details if status requires it
          ...(["Reserved", "Under Offer", "Sold"].includes(item.status) && {
            clientDetails: {
              clientName: item.clientName || "",
              clientEmail: item.clientEmail || "",
              agentName: item.agentName || "",
              agencyName: item.agencyName || "",
            },
          }),
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      const fileType = droppedFile.name.split(".").pop()?.toLowerCase()

      if (!["csv", "xls", "xlsx"].includes(fileType || "")) {
        toast({
          title: "Invalid file format",
          description: "Please upload a CSV or Excel file (.csv, .xls, .xlsx)",
          variant: "destructive",
        })
        return
      }

      setFile(droppedFile)
      parseFile(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
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
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
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
                          <TableHead>Unit</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Phase</TableHead>
                          <TableHead>Building</TableHead>
                          <TableHead>Floor</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Beds</TableHead>
                          <TableHead>Area (sqft)</TableHead>
                          <TableHead>Price/sqft</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.unit || item.unitNumber || "Unknown"}</TableCell>
                            <TableCell>{item.project || item.projectName || "Unknown"}</TableCell>
                            <TableCell>{item.phase || "NA"}</TableCell>
                            <TableCell>{item.building || "NA"}</TableCell>
                            <TableCell>{item.floor || "NA"}</TableCell>
                            <TableCell>{item.type || "Unknown"}</TableCell>
                            <TableCell>{item.beds || item.bedrooms || 0}</TableCell>
                            <TableCell>{item.area || 0}</TableCell>
                            <TableCell>
                              ${item.pricePerSqft || Math.round((item.price || 0) / (item.area || 1))}
                            </TableCell>
                            <TableCell>${Number(item.price || 0).toLocaleString()}</TableCell>
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
                  <li>unit - Unit number</li>
                  <li>project - Project name</li>
                  <li>type - Unit type</li>
                  <li>price - Price (numeric)</li>
                  <li>area - Total area in sqft (numeric)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Optional Fields:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>phase - Project phase</li>
                  <li>building - Building name</li>
                  <li>floor - Floor number</li>
                  <li>beds - Number of bedrooms</li>
                  <li>pricePerSqft - Price per square foot</li>
                  <li>status - Unit status (Available, Reserved, Under Offer, Sold)</li>
                  <li>bathrooms - Number of bathrooms</li>
                  <li>views - View type</li>
                  <li>clientName - Client name (required for Reserved, Under Offer, Sold)</li>
                  <li>clientEmail - Client email (required for Reserved, Under Offer, Sold)</li>
                  <li>agentName - Agent name (required for Reserved, Under Offer, Sold)</li>
                  <li>agencyName - Agency name (optional)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Sample CSV Format:</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                unit,project,phase,building,floor,type,beds,area,pricePerSqft,price,status
                <br />
                "A101","Azure Towers","Phase 1","Tower A",1,"Apartment",2,1200,625,750000,"Available"
                <br />
                "PH501","Sunset Heights","Phase 2","Tower B",5,"Penthouse",3,2100,595,1250000,"Reserved"
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
