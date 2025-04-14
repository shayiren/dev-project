"use client"

import { Suspense } from "react"
import PropertiesClientPage from "./client-page"

export default function PropertiesClientWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesClientPage />
    </Suspense>
  )
}
