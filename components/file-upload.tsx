"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  label: string
  accept: string
  multiple?: boolean
  onUpload: (files: File[]) => void
}

export function FileUpload({ label, accept, multiple = false, onUpload }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
      onUpload(newFiles)
    }
  }

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove))
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById(`fileInput-${label}`)?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
        <input
          id={`fileInput-${label}`}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
      </div>
      {files.length > 0 && (
        <ul className="mt-2 divide-y divide-gray-200 border rounded-md">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between py-2 px-4">
              <span className="text-sm truncate">{file.name}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file)}>
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
