"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BulkUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file")
      return
    }

    setUploading(true)
    setMessage("")

    // Simulate upload process
    setTimeout(() => {
      setMessage(`Successfully processed ${file.name} - 25 properties imported`)
      setUploading(false)
      setFile(null)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Bulk Upload Properties</h2>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="file">CSV File</Label>
        <Input id="file" type="file" accept=".csv" onChange={handleFileChange} disabled={uploading} />
      </div>
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  )
}
