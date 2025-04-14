/**
 * Utility functions for managing application data
 */

/**
 * Load developers from localStorage or create defaults if none exist
 */
export function loadDevelopers(): string[] {
  const savedDevelopers = localStorage.getItem("developers")
  if (savedDevelopers) {
    try {
      return JSON.parse(savedDevelopers)
    } catch (error) {
      console.error("Error parsing developers from localStorage:", error)
    }
  }

  // Set default developers if none exist
  const defaultDevelopers = ["Prime Developers", "City Builders", "Metro Construction"]
  localStorage.setItem("developers", JSON.stringify(defaultDevelopers))
  return defaultDevelopers
}

/**
 * Save developers to localStorage and notify other components
 */
export function saveDevelopers(developers: string[]): void {
  localStorage.setItem("developers", JSON.stringify(developers))

  // Dispatch a storage event to notify other components
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "developers",
      newValue: JSON.stringify(developers),
    }),
  )
}

/**
 * Load projects from localStorage or create defaults if none exist
 */
export function loadProjects(): Array<{
  name: string
  developerName: string
  description?: string
  location?: string
  totalUnits?: number
}> {
  const savedProjects = localStorage.getItem("projects")
  if (savedProjects) {
    try {
      return JSON.parse(savedProjects)
    } catch (error) {
      console.error("Error parsing projects from localStorage:", error)
    }
  }

  // Set default projects if none exist
  const defaultProjects = [
    { name: "Sunset Residences", developerName: "Prime Developers", location: "Dubai Marina", totalUnits: 120 },
    { name: "Ocean View Towers", developerName: "Prime Developers", location: "Palm Jumeirah", totalUnits: 85 },
    { name: "Urban Heights", developerName: "City Builders", location: "Downtown", totalUnits: 200 },
    { name: "Downtown Lofts", developerName: "City Builders", location: "Business Bay", totalUnits: 150 },
    { name: "Metro Gardens", developerName: "Metro Construction", location: "JLT", totalUnits: 180 },
    { name: "City Center Plaza", developerName: "Metro Construction", location: "Deira", totalUnits: 95 },
  ]
  localStorage.setItem("projects", JSON.stringify(defaultProjects))
  return defaultProjects
}

/**
 * Save projects to localStorage and notify other components
 */
export function saveProjects(
  projects: Array<{
    name: string
    developerName: string
    description?: string
    location?: string
    totalUnits?: number
  }>,
): void {
  localStorage.setItem("projects", JSON.stringify(projects))

  // Dispatch a storage event to notify other components
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "projects",
      newValue: JSON.stringify(projects),
    }),
  )
}
