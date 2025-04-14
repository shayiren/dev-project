"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSize?: number // in MB
  label?: string
  buttonText?: string
  multiple?: boolean
}

export function FileUploader({
  onFileSelect,
  accept = "image/*",
  maxSize = 5, // Default 5MB
  label = "Upload a file",
  buttonText = "Select File",
  multiple = false,
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || files.length === 0) {
      setSelectedFile(null)
      onFileSelect(null)
      return
    }

    const file = files[0]

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      setSelectedFile(null)
      onFileSelect(null)
      return
    }

    setError(null)
    setSelectedFile(file)
    onFileSelect(file)
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setError(null)
    onFileSelect(null)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
          <Upload className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
        <Input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          multiple={multiple}
          className="hidden"
        />

        {selectedFile && (
          <Button type="button" variant="ghost" size="icon" onClick={clearSelection}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {selectedFile && (
        <p className="text-sm text-muted-foreground">
          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
