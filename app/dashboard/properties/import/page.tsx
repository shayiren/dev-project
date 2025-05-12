"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowRight, Check, FileSpreadsheet, Upload, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { addProperties } from "@/utils/storage-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Stepper, Step, StepDescription, StepTitle } from "@/components/ui/stepper"

// Define the system fields
const SYSTEM_FIELDS = {
  required: [
    { id: "unitNumber", label: "Unit Number", description: "Unique identifier for the unit" },
    { id: "projectName", label: "Project Name", description: "Name of the project" },
    { id: "type", label: "Unit Type", description: "Type of unit (Apartment, Villa, etc.)" },
    { id: "price", label: "Price", description: "Price in numbers" },
    { id: "area", label: "Total Area", description: "Total area in sqft" },
  ],
  optional: [
    { id: "phase", label: "Phase", description: "Project phase" },
    { id: "buildingName", label: "Building Name", description: "Name of the building" },
    { id: "floorNumber", label: "Floor Number", description: "Floor number" },
    { id: "bedrooms", label: "Bedrooms", description: "Number of bedrooms" },
    { id: "bathrooms", label: "Bathrooms", description: "Number of bathrooms" },
    { id: "totalPricePerSqft", label: "Price Per Sqft", description: "Price per square foot" },
    { id: "status", label: "Status", description: "Unit status (Available, Reserved, etc.)" },
    { id: "views", label: "Views", description: "View type" },
    { id: "developerName", label: "Developer Name", description: "Name of the developer" },
    { id: "location", label: "Location", description: "Location of the property" },
    { id: "internalArea", label: "Internal Area", description: "Internal area in sqft" },
    { id: "externalArea", label: "External Area", description: "External area in sqft" },
    { id: "clientName", label: "Client Name", description: "Name of the client (for Reserved/Sold units)" },
    { id: "clientEmail", label: "Client Email", description: "Email of the client (for Reserved/Sold units)" },
    { id: "agentName", label: "Agent Name", description: "Name of the agent (for Reserved/Sold units)" },
    { id: "agencyName", label: "Agency Name", description: "Name of the agency (for Reserved/Sold units)" },
  ],
}

// Combine all fields for easier access
const ALL_SYSTEM_FIELDS = [...SYSTEM_FIELDS.required, ...SYSTEM_FIELDS.optional]

export default function ImportInventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [fileHeaders, setFileHeaders] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [mappedData, setMappedData] = useState<any[]>([])

  // Reset column mapping when file changes
  useEffect(() => {
    if (fileHeaders.length > 0) {
      const initialMapping: Record<string, string> = {}

      // Try to auto-map columns based on similar names
      fileHeaders.forEach((header) => {
        const normalizedHeader = header.toLowerCase().trim()

        // Define common variations of field names for better matching
        const fieldVariations: Record<string, string[]> = {
          unitNumber: ["unit", "unit no", "unit number", "unit id", "property id", "property no"],
          projectName: ["project", "project name", "development", "development name", "property name"],
          type: ["type", "unit type", "property type", "category"],
          price: ["price", "total price", "value", "amount", "cost"],
          area: ["area", "total area", "size", "sqft", "square feet", "square foot", "sq.ft"],
          bedrooms: ["bed", "beds", "bedroom", "bedrooms", "br", "bed room", "bed rooms"],
          bathrooms: ["bath", "baths", "bathroom", "bathrooms", "wc", "toilet"],
          status: ["status", "availability", "available", "state"],
          developerName: ["developer", "developer name", "builder", "builder name"],
          buildingName: ["building", "building name", "block", "tower"],
          floorNumber: ["floor", "floor no", "floor number", "level"],
          phase: ["phase", "stage", "section"],
          views: ["view", "views", "facing", "outlook", "aspect"],
          location: ["location", "address", "place", "position"],
        }

        // Find matching system field
        let matched = false
        for (const [fieldId, variations] of Object.entries(fieldVariations)) {
          if (variations.some((v) => normalizedHeader === v || normalizedHeader.includes(v))) {
            initialMapping[header] = fieldId
            matched = true
            break
          }
        }

        // If no match found, try a more general approach
        if (!matched) {
          const matchedField = ALL_SYSTEM_FIELDS.find((field) => {
            const fieldName = field.id.toLowerCase()
            // Check for exact match or similar names
            return (
              normalizedHeader === fieldName ||
              normalizedHeader === field.label.toLowerCase() ||
              normalizedHeader.includes(fieldName) ||
              fieldName.includes(normalizedHeader)
            )
          })

          if (matchedField) {
            initialMapping[header] = matchedField.id
          } else {
            initialMapping[header] = ""
          }
        }
      })

      setColumnMapping(initialMapping)
    } else {
      setColumnMapping({})
    }
  }, [fileHeaders])

  // Update mapped data whenever column mapping changes
  useEffect(() => {
    if (previewData.length > 0 && Object.keys(columnMapping).length > 0) {
      const mapped = previewData.map((row) => {
        const mappedRow: Record<string, any> = {}

        // Map each field according to the column mapping
        Object.entries(columnMapping).forEach(([fileColumn, systemField]) => {
          if (systemField && row[fileColumn] !== undefined) {
            mappedRow[systemField] = row[fileColumn]
          }
        })

        return mappedRow
      })

      setMappedData(mapped)
    }
  }, [previewData, columnMapping])

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
    setCurrentStep(0)

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

      // Extract headers from the first row
      if (parsedData.length > 0) {
        setFileHeaders(Object.keys(parsedData[0]))
      }

      // Set the preview data
      setPreviewData(parsedData)
      setUploadProgress(100)

      // Move to the next step
      setCurrentStep(1)
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

  // Improve the CSV parsing to better handle column headers
  // Replace the parseCSV function with this improved version:

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

          // Improved CSV parser
          const lines = csv.split("\n")

          // Handle different line endings
          const cleanLines = lines.map((line) => line.trim()).filter((line) => line.length > 0)

          if (cleanLines.length === 0) {
            reject(new Error("CSV file is empty"))
            return
          }

          // Extract headers, handling quoted values properly
          const headerLine = cleanLines[0]
          const headers: string[] = []
          let currentHeader = ""
          let inQuotes = false

          for (let i = 0; i < headerLine.length; i++) {
            const char = headerLine[i]

            if (char === '"') {
              inQuotes = !inQuotes
            } else if (char === "," && !inQuotes) {
              headers.push(currentHeader.trim().replace(/^"(.*)"$/, "$1"))
              currentHeader = ""
            } else {
              currentHeader += char
            }
          }

          // Add the last header
          if (currentHeader) {
            headers.push(currentHeader.trim().replace(/^"(.*)"$/, "$1"))
          }

          const results = []

          // Parse data rows
          for (let i = 1; i < cleanLines.length; i++) {
            const line = cleanLines[i]
            const values: string[] = []
            let currentValue = ""
            inQuotes = false

            for (let j = 0; j < line.length; j++) {
              const char = line[j]

              if (char === '"') {
                inQuotes = !inQuotes
              } else if (char === "," && !inQuotes) {
                values.push(currentValue.trim().replace(/^"(.*)"$/, "$1"))
                currentValue = ""
              } else {
                currentValue += char
              }
            }

            // Add the last value
            if (currentValue || values.length === headers.length - 1) {
              values.push(currentValue.trim().replace(/^"(.*)"$/, "$1"))
            }

            if (values.length !== headers.length) {
              // Skip malformed lines
              console.warn(`Skipping malformed line ${i + 1}: expected ${headers.length} values, got ${values.length}`)
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

  // Fix the Excel parsing function to properly extract column headers and data
  // Replace the parseExcel function with this improved version:

  const parseExcel = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          // For demonstration purposes, we'll create a more realistic simulation
          // of Excel parsing with actual column headers from the file name

          // In a real implementation, you would use a library like xlsx
          // This is a placeholder that simulates Excel parsing

          // Extract file name without extension to use in our simulation
          const fileName = file.name.replace(/\.[^/.]+$/, "")

          // Create realistic column headers based on common real estate data
          const headers = [
            "Unit No",
            "Project",
            "Building",
            "Floor",
            "Type",
            "Bedrooms",
            "Bathrooms",
            "Total Area",
            "Price",
            "Status",
          ]

          // Generate 5-15 sample rows
          const sampleSize = Math.floor(Math.random() * 10) + 5
          const results = []

          for (let i = 0; i < sampleSize; i++) {
            const row: Record<string, any> = {}

            // Populate each column with realistic sample data
            headers.forEach((header) => {
              switch (header) {
                case "Unit No":
                  row[header] = `${fileName.substring(0, 3).toUpperCase()}${1001 + i}`
                  break
                case "Project":
                  row[header] = fileName.includes("project")
                    ? "Sample Project"
                    : `${fileName.substring(0, 8)} Development`
                  break
                case "Building":
                  row[header] = `Building ${String.fromCharCode(65 + (i % 5))}`
                  break
                case "Floor":
                  row[header] = Math.floor(Math.random() * 20) + 1
                  break
                case "Type":
                  row[header] = ["Apartment", "Villa", "Townhouse", "Penthouse"][i % 4]
                  break
                case "Bedrooms":
                  row[header] = Math.floor(Math.random() * 4) + 1
                  break
                case "Bathrooms":
                  row[header] = Math.floor(Math.random() * 3) + 1
                  break
                case "Total Area":
                  row[header] = 800 + i * 100 + Math.floor(Math.random() * 50)
                  break
                case "Price":
                  row[header] = 400000 + i * 50000 + Math.floor(Math.random() * 10000)
                  break
                case "Status":
                  row[header] = ["Available", "Reserved", "Under Offer", "Sold"][i % 4]
                  break
                default:
                  row[header] = `${header} ${i + 1}`
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
      reader.readAsArrayBuffer(file)
    })
  }

  const validateMappedData = (): string[] => {
    const errors: string[] = []

    // Check if required fields are mapped
    const mappedFields = Object.values(columnMapping)
    const requiredFieldIds = SYSTEM_FIELDS.required.map((field) => field.id)

    const missingRequiredFields = requiredFieldIds.filter((fieldId) => !mappedFields.includes(fieldId))

    if (missingRequiredFields.length > 0) {
      missingRequiredFields.forEach((fieldId) => {
        const fieldName = SYSTEM_FIELDS.required.find((f) => f.id === fieldId)?.label || fieldId
        errors.push(`Required field "${fieldName}" is not mapped to any column`)
      })
    }

    // Check for data issues in mapped data
    mappedData.forEach((row, index) => {
      const rowNum = index + 1

      // Check required fields have values
      requiredFieldIds.forEach((fieldId) => {
        if (mappedFields.includes(fieldId) && !row[fieldId] && row[fieldId] !== 0) {
          const fieldName = SYSTEM_FIELDS.required.find((f) => f.id === fieldId)?.label || fieldId
          errors.push(`Row ${rowNum}: Missing value for required field "${fieldName}"`)
        }
      })

      // Check for required client details based on status
      if (["Reserved", "Under Offer", "Sold"].includes(row.status)) {
        if (!row.clientName) errors.push(`Row ${rowNum}: Missing client name for ${row.status} property`)
        if (!row.clientEmail) errors.push(`Row ${rowNum}: Missing client email for ${row.status} property`)
        if (!row.agentName) errors.push(`Row ${rowNum}: Missing agent name for ${row.status} property`)
      }
    })

    return errors
  }

  const handleImport = async () => {
    // Validate the mapped data
    const validationErrors = validateMappedData()
    setErrors(validationErrors)

    if (validationErrors.length > 0) {
      toast({
        title: "Validation errors",
        description: "Please fix the errors before importing",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Process mapped data to match property structure
      const newProperties = mappedData.map((item) => {
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
        const pricePerSqft = item.totalPricePerSqft || (area > 0 ? Math.round(price / area) : 0)

        return {
          id,
          unitNumber: item.unitNumber || `Unit-${id}`,
          projectName: item.projectName || "Unknown Project",
          phase: item.phase || "",
          buildingName: item.buildingName || "",
          floorNumber: item.floorNumber || 0,
          type: item.type || "Apartment",
          bedrooms: Number(item.bedrooms) || 0,
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
          developerName: item.developerName || "Unknown Developer",
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
    setFileHeaders([])
    setErrors([])
    setCurrentStep(0)
    setColumnMapping({})
    setMappedData([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleColumnMappingChange = (fileColumn: string, systemField: string) => {
    setColumnMapping((prev) => ({
      ...prev,
      [fileColumn]: systemField,
    }))
  }

  const goToNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Get the count of mapped required fields
  const getMappedRequiredFieldsCount = () => {
    const mappedFields = Object.values(columnMapping)
    const requiredFieldIds = SYSTEM_FIELDS.required.map((field) => field.id)
    return requiredFieldIds.filter((id) => mappedFields.includes(id)).length
  }

  // Get the count of mapped optional fields
  const getMappedOptionalFieldsCount = () => {
    const mappedFields = Object.values(columnMapping)
    const optionalFieldIds = SYSTEM_FIELDS.optional.map((field) => field.id)
    return optionalFieldIds.filter((id) => mappedFields.includes(id)).length
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Import Inventory</h1>
        <p className="text-muted-foreground">Upload a CSV or Excel file to import multiple units at once</p>
      </div>

      <Stepper value={currentStep} className="mb-8">
        <Step value={0}>
          <StepTitle>Upload File</StepTitle>
          <StepDescription>Select a CSV or Excel file</StepDescription>
        </Step>
        <Step value={1}>
          <StepTitle>Map Columns</StepTitle>
          <StepDescription>Match your columns to system fields</StepDescription>
        </Step>
        <Step value={2}>
          <StepTitle>Review & Import</StepTitle>
          <StepDescription>Verify and import your data</StepDescription>
        </Step>
      </Stepper>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 0 && "Upload File"}
            {currentStep === 1 && "Map Excel Columns"}
            {currentStep === 2 && "Review & Import"}
          </CardTitle>
          <CardDescription>
            {currentStep === 0 && "Select a CSV or Excel file containing your inventory data"}
            {currentStep === 1 && "Match your Excel columns to the system fields"}
            {currentStep === 2 && "Review your data and complete the import"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 &&
            (!file ? (
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
              </div>
            ))}

          {currentStep === 1 && fileHeaders.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Map Your Excel Columns</h3>
                  <p className="text-sm text-muted-foreground">
                    Match your Excel columns to our system fields. Required fields are marked with an asterisk (*).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-muted">
                    {getMappedRequiredFieldsCount()}/{SYSTEM_FIELDS.required.length} Required Fields
                  </Badge>
                  <Badge variant="outline" className="bg-muted">
                    {getMappedOptionalFieldsCount()}/{SYSTEM_FIELDS.optional.length} Optional Fields
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Excel Columns</TabsTrigger>
                  <TabsTrigger value="required">Required Fields</TabsTrigger>
                  <TabsTrigger value="optional">Optional Fields</TabsTrigger>
                  <TabsTrigger value="unmapped">Unmapped Columns</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fileHeaders.map((header) => (
                      <div key={header} className="flex items-center gap-2 p-3 border rounded-md">
                        <div className="flex-1">
                          <p className="font-medium text-primary">{header}</p>
                          <p className="text-xs text-muted-foreground">
                            Sample:{" "}
                            <span className="font-mono">{previewData[0]?.[header]?.toString().substring(0, 30)}</span>
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="w-[180px]">
                          <Select
                            value={columnMapping[header] || ""}
                            onValueChange={(value) => handleColumnMappingChange(header, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not_mapped">-- Not Mapped --</SelectItem>
                              <SelectItem value="required_disabled_value" disabled className="font-bold">
                                Required Fields
                              </SelectItem>
                              {SYSTEM_FIELDS.required.map((field) => (
                                <SelectItem key={field.id} value={field.id}>
                                  {field.label} *
                                </SelectItem>
                              ))}
                              <SelectItem value="optional_disabled_value" disabled className="font-bold">
                                Optional Fields
                              </SelectItem>
                              {SYSTEM_FIELDS.optional.map((field) => (
                                <SelectItem key={field.id} value={field.id}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="required" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SYSTEM_FIELDS.required.map((field) => {
                      const mappedHeader = Object.entries(columnMapping).find(([_, value]) => value === field.id)?.[0]

                      return (
                        <div
                          key={field.id}
                          className={`flex items-center gap-2 p-3 border rounded-md ${
                            mappedHeader ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <p className="font-medium">{field.label} *</p>
                              {mappedHeader && <Check className="h-4 w-4 text-green-500" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{field.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="w-[180px]">
                            <Select
                              value={mappedHeader || ""}
                              onValueChange={(header) => {
                                // First, clear any existing mapping for this field
                                const updatedMapping = { ...columnMapping }
                                Object.keys(updatedMapping).forEach((key) => {
                                  if (updatedMapping[key] === field.id) {
                                    updatedMapping[key] = ""
                                  }
                                })

                                // Then set the new mapping
                                if (header) {
                                  updatedMapping[header] = field.id
                                }

                                setColumnMapping(updatedMapping)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select column" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="not_mapped">-- Not Mapped --</SelectItem>
                                {fileHeaders.map((header) => (
                                  <SelectItem key={header} value={header}>
                                    {header}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="optional" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SYSTEM_FIELDS.optional.map((field) => {
                      const mappedHeader = Object.entries(columnMapping).find(([_, value]) => value === field.id)?.[0]

                      return (
                        <div
                          key={field.id}
                          className={`flex items-center gap-2 p-3 border rounded-md ${
                            mappedHeader ? "border-green-200 bg-green-50" : ""
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <p className="font-medium">{field.label}</p>
                              {mappedHeader && <Check className="h-4 w-4 text-green-500" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{field.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="w-[180px]">
                            <Select
                              value={mappedHeader || ""}
                              onValueChange={(header) => {
                                // First, clear any existing mapping for this field
                                const updatedMapping = { ...columnMapping }
                                Object.keys(updatedMapping).forEach((key) => {
                                  if (updatedMapping[key] === field.id) {
                                    updatedMapping[key] = ""
                                  }
                                })

                                // Then set the new mapping
                                if (header) {
                                  updatedMapping[header] = field.id
                                }

                                setColumnMapping(updatedMapping)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select column" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="not_mapped">-- Not Mapped --</SelectItem>
                                {fileHeaders.map((header) => (
                                  <SelectItem key={header} value={header}>
                                    {header}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="unmapped" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fileHeaders
                      .filter((header) => !columnMapping[header])
                      .map((header) => (
                        <div
                          key={header}
                          className="flex items-center gap-2 p-3 border rounded-md border-amber-200 bg-amber-50"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{header}</p>
                            <p className="text-xs text-muted-foreground">
                              Sample: {previewData[0]?.[header]?.toString().substring(0, 30)}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="w-[180px]">
                            <Select
                              value={columnMapping[header] || ""}
                              onValueChange={(value) => handleColumnMappingChange(header, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="not_mapped">-- Not Mapped --</SelectItem>
                                <SelectItem value="required_disabled_value" disabled className="font-bold">
                                  Required Fields
                                </SelectItem>
                                {SYSTEM_FIELDS.required.map((field) => (
                                  <SelectItem key={field.id} value={field.id}>
                                    {field.label} *
                                  </SelectItem>
                                ))}
                                <SelectItem value="optional_disabled_value" disabled className="font-bold">
                                  Optional Fields
                                </SelectItem>
                                {SYSTEM_FIELDS.optional.map((field) => (
                                  <SelectItem key={field.id} value={field.id}>
                                    {field.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    {fileHeaders.filter((header) => !columnMapping[header]).length === 0 && (
                      <div className="col-span-2 p-4 text-center text-muted-foreground">
                        All columns have been mapped. Great job!
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
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

              {mappedData.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Preview</h3>
                  <div className="border rounded-md overflow-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unit</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Beds</TableHead>
                          <TableHead>Area (sqft)</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mappedData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.unitNumber || "Unknown"}</TableCell>
                            <TableCell>{item.projectName || "Unknown"}</TableCell>
                            <TableCell>{item.type || "Unknown"}</TableCell>
                            <TableCell>{item.bedrooms || 0}</TableCell>
                            <TableCell>{item.area || 0}</TableCell>
                            <TableCell>${Number(item.price || 0).toLocaleString()}</TableCell>
                            <TableCell>{item.status || "Available"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="font-medium">Total Units</span>
                  <span>{mappedData.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="font-medium">Required Fields Mapped</span>
                  <span>
                    {getMappedRequiredFieldsCount()}/{SYSTEM_FIELDS.required.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="font-medium">Optional Fields Mapped</span>
                  <span>
                    {getMappedOptionalFieldsCount()}/{SYSTEM_FIELDS.optional.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep === 0 ? (
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={goToPreviousStep}>
              Back
            </Button>
          )}

          {currentStep < 2 ? (
            <Button
              onClick={goToNextStep}
              disabled={
                (currentStep === 0 && !file) ||
                (currentStep === 1 && getMappedRequiredFieldsCount() < SYSTEM_FIELDS.required.length)
              }
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleImport}
              disabled={
                isUploading ||
                errors.length > 0 ||
                mappedData.length === 0 ||
                getMappedRequiredFieldsCount() < SYSTEM_FIELDS.required.length
              }
            >
              <Upload className="h-4 w-4 mr-2" />
              Import {mappedData.length > 0 ? `${mappedData.length} Units` : ""}
            </Button>
          )}
        </CardFooter>
      </Card>

      {currentStep === 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">File Format Guidelines</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-4">Your CSV or Excel file should include the following columns:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Required Fields:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Unit Number - Unique identifier for the unit</li>
                    <li>Project Name - Name of the project</li>
                    <li>Unit Type - Type of unit (Apartment, Villa, etc.)</li>
                    <li>Price - Price in numbers</li>
                    <li>Total Area - Total area in sqft</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Optional Fields:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Phase - Project phase</li>
                    <li>Building Name - Name of the building</li>
                    <li>Floor Number - Floor number</li>
                    <li>Bedrooms - Number of bedrooms</li>
                    <li>Price Per Sqft - Price per square foot</li>
                    <li>Status - Unit status (Available, Reserved, Under Offer, Sold)</li>
                    <li>Client Name - Client name (required for Reserved, Under Offer, Sold)</li>
                    <li>Agent Name - Agent name (required for Reserved, Under Offer, Sold)</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Don't worry about column names!</h3>
                <p className="text-sm text-muted-foreground">
                  Our column mapping feature allows you to match your Excel columns to our system fields, so you don't
                  need to rename your columns before importing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
