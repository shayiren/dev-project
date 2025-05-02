"use client"

import { Suspense } from "react"
import PropertiesClient from "./properties-client"

export default function PropertiesClientWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesClient />
    </Suspense>
  )
}
