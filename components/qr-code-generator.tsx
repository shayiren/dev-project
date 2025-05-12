"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"

interface QRCodeGeneratorProps {
  data: string
  size?: number
  level?: "L" | "M" | "Q" | "H"
  includeMargin?: boolean
  className?: string
}

export function QRCodeGenerator({
  data,
  size = 200,
  level = "M",
  includeMargin = true,
  className,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCode.toCanvas(
        canvasRef.current,
        data,
        {
          width: size,
          margin: includeMargin ? 4 : 0,
          errorCorrectionLevel: level,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        },
        (error) => {
          if (error) console.error("Error generating QR code:", error)
        },
      )
    }
  }, [data, size, level, includeMargin])

  return (
    <div className={className}>
      <canvas ref={canvasRef} />
    </div>
  )
}
