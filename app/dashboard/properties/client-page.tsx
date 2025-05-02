"use client"

import PropertiesClient from "./properties-client"
import { initializeSampleData } from "@/utils/add-sample-properties"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"

export default function PropertiesClientPage() {
  return (
    <PropertiesClient
      addSampleDataButton={
        <Button
          variant="outline"
          className="ml-2"
          onClick={() => {
            const count = initializeSampleData(30)
            toast({
              title: "Sample Data Added",
              description: `${count} sample properties have been added.`,
            })
            // Refresh the page to show the new data
            window.location.reload()
          }}
        >
          <Database className="mr-2 h-4 w-4" />
          Add Sample Data
        </Button>
      }
    />
  )
}
