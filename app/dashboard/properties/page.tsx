import { Suspense } from "react"
import PropertiesClient from "./properties-client"

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading properties...</div>}>
      <PropertiesClient />
    </Suspense>
  )
}
