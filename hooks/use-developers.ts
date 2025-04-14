"use client"

import { useState, useEffect } from "react"

export function useDevelopers() {
  const [developers, setDevelopers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load developers from localStorage
    try {
      const savedDevelopers = localStorage.getItem("developers")
      if (savedDevelopers) {
        const parsedDevelopers = JSON.parse(savedDevelopers)
        if (Array.isArray(parsedDevelopers)) {
          setDevelopers(parsedDevelopers)
        } else {
          // Initialize with default developers if not an array
          setDevelopers(["Prime Developers", "City Builders", "Metro Construction", "Ardeee"])
        }
      } else {
        // Initialize with default developers if not found
        const defaultDevelopers = ["Prime Developers", "City Builders", "Metro Construction", "Ardeee"]
        setDevelopers(defaultDevelopers)
        localStorage.setItem("developers", JSON.stringify(defaultDevelopers))
      }
    } catch (error) {
      console.error("Error loading developers:", error)
      // Initialize with default developers on error
      setDevelopers(["Prime Developers", "City Builders", "Metro Construction", "Ardeee"])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addDeveloper = (name: string): boolean => {
    if (!name.trim() || developers.includes(name.trim())) {
      return false
    }

    try {
      const updatedDevelopers = [...developers, name.trim()]
      setDevelopers(updatedDevelopers)
      localStorage.setItem("developers", JSON.stringify(updatedDevelopers))

      // Also update the detailed developers list
      try {
        const savedDeveloperDetails = localStorage.getItem("realEstateDeveloperDetails")
        if (savedDeveloperDetails) {
          const parsedDetails = JSON.parse(savedDeveloperDetails)
          if (Array.isArray(parsedDetails)) {
            const newDeveloperDetail = {
              id: `dev${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: name.trim(),
              description: "A leading developer with years of experience.",
              contactPerson: "Contact Person",
              phoneNumber: "+1234567890",
              email: `info@${name.toLowerCase().replace(/\s+/g, "")}.com`,
              licenseNumber: `DEV-${Math.floor(10000 + Math.random() * 90000)}`,
              address: "Main Street, City",
              logo: "/placeholder.svg?height=100&width=200",
            }
            parsedDetails.push(newDeveloperDetail)
            localStorage.setItem("realEstateDeveloperDetails", JSON.stringify(parsedDetails))
          }
        }
      } catch (error) {
        console.error("Error updating developer details:", error)
      }

      return true
    } catch (error) {
      console.error("Error adding developer:", error)
      return false
    }
  }

  return { developers, isLoading, addDeveloper }
}
