"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SalesOfferUploadProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File, metadata: any) => void
  propertyName: string
  existingOffer?: {
    fileName: string
    uploadDate: string
    version?: string
  }
}

export function SalesOfferUpload({ isOpen, onClose, onUpload, propertyName, existingOffer }: SalesOfferUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState({
    version: "1.0",
    validUntil: "",
    description: "",
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.includes("pdf") && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
        setUploadError("Please select a PDF file")
        return
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setUploadError("File size must be less than 10MB")
        return
      }

      setFile(selectedFile)
      setUploadError(null)

      // Auto-increment version if updating existing offer
      if (existingOffer) {
        const currentVersion = Number.parseFloat(existingOffer.version || "1.0")
        setMetadata({ ...metadata, version: (currentVersion + 0.1).toFixed(1) })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      await onUpload(file, metadata)
      onClose()
      setFile(null)
      setMetadata({
        version: "1.0",
        validUntil: "",
        description: "",
      })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setFile(null)
    setUploadError(null)
    setMetadata({
      version: "1.0",
      validUntil: "",
      description: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingOffer ? "Update" : "Upload"} Sales Offer - {propertyName}
          </DialogTitle>
          <DialogDescription>
            {existingOffer
              ? "Upload a new version of the sales offer document."
              : "Upload a sales offer document for this property."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {existingOffer && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Current Sales Offer</h4>
              <p className="text-sm text-blue-700">
                {existingOffer.fileName} (v{existingOffer.version})
              </p>
              <p className="text-xs text-blue-600">
                Uploaded: {new Date(existingOffer.uploadDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="file">Sales Offer Document (PDF) *</Label>
            <Input id="file" type="file" accept=".pdf" onChange={handleFileChange} />
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="version">Version *</Label>
              <Input
                id="version"
                value={metadata.version}
                onChange={(e) => setMetadata({ ...metadata, version: e.target.value })}
                placeholder="1.0"
                required
              />
            </div>
            <div>
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={metadata.validUntil}
                onChange={(e) => setMetadata({ ...metadata, validUntil: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this sales offer version..."
              value={metadata.description}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">File Requirements:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• PDF format only</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Document should include property details and pricing</li>
              <li>• Version number will be used for tracking updates</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : existingOffer ? "Update Offer" : "Upload Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
