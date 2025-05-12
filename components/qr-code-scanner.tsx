"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"

interface QRCodeScannerProps {
  onScan: (data: string) => void
  width?: number
  height?: number
  fps?: number
}

export function QRCodeScanner({ onScan, width = 500, height = 400, fps = 10 }: QRCodeScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize scanner
    if (containerRef.current && !scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader")
    }

    return () => {
      // Clean up on unmount
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch((error) => console.error("Error stopping scanner:", error))
      }
    }
  }, [scanning])

  const startScanner = () => {
    if (!scannerRef.current) return

    setScanning(true)

    const qrCodeSuccessCallback = (decodedText: string) => {
      onScan(decodedText)
    }

    const config = { fps }

    scannerRef.current.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, undefined).catch((error) => {
      console.error("Error starting scanner:", error)
      if (error.toString().includes("permission")) {
        setPermissionDenied(true)
      }
      setScanning(false)
    })
  }

  const stopScanner = () => {
    if (!scannerRef.current || !scanning) return

    scannerRef.current
      .stop()
      .then(() => {
        setScanning(false)
      })
      .catch((error) => {
        console.error("Error stopping scanner:", error)
      })
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        id="qr-reader"
        ref={containerRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="border rounded overflow-hidden bg-gray-100"
      />

      {permissionDenied ? (
        <div className="text-red-500 text-center">Camera access denied. Please allow camera access and try again.</div>
      ) : (
        <div className="flex space-x-4">
          {!scanning ? (
            <Button onClick={startScanner}>Start Scanner</Button>
          ) : (
            <Button variant="outline" onClick={stopScanner}>
              Stop Scanner
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
