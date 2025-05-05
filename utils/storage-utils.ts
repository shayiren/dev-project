/**
 * Utility functions for working with localStorage
 */

// Check if we're running in a browser environment
const isBrowser = typeof window !== "undefined"

// Safe localStorage access - export this function
export function getLocalStorage(key: string) {
  if (typeof window === "undefined") return null
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error)
    return null
  }
}

// Set localStorage item with error handling - export this function
export function setLocalStorage(key: string, value: any) {
  if (typeof window === "undefined") return false
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error)
    return false
  }
}

// Save data to localStorage with error handling
export function saveToStorage<T>(key: string, data: T): boolean {
  return setLocalStorage(key, data)
}

// Load data from localStorage with error handling
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const savedData = localStorage.getItem(key)
    if (savedData) {
      return JSON.parse(savedData) as T
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
  }
  return defaultValue
}

// Add a single property to storage
export function addProperty(property: any): boolean {
  const localStorage = getLocalStorage("properties")
  if (!localStorage) return false

  try {
    // Get existing properties
    const properties = loadFromStorage<any[]>("properties", [])

    // Add new property
    properties.push(property)

    // Save back to storage
    return saveToStorage("properties", properties)
  } catch (error) {
    console.error("Error adding property:", error)
    return false
  }
}

// Update a property in storage
export function updateProperty(updatedProperty: any): boolean {
  if (!isBrowser) return false

  try {
    const properties = loadFromStorage<any[]>("properties", [])

    // If the property is being marked as sold, add a soldDate if it doesn't exist
    if (updatedProperty.status === "Sold" && !updatedProperty.soldDate) {
      updatedProperty.soldDate = new Date().toISOString().split("T")[0]
    }

    const updatedProperties = properties.map((property) =>
      property.id === updatedProperty.id ? updatedProperty : property,
    )

    return saveToStorage("properties", updatedProperties)
  } catch (error) {
    console.error("Error updating property:", error)
    return false
  }
}

// Get all properties except sold ones
export function getAllPropertiesExceptSold(): any[] {
  const allProperties = loadFromStorage<any[]>("properties", [])
  return allProperties.filter((property) => property.status !== "Sold")
}

// Get only sold properties
export function getSoldProperties(): any[] {
  const allProperties = loadFromStorage<any[]>("properties", [])
  return allProperties.filter((property) => property.status === "Sold")
}

// Add multiple properties to storage
export function addProperties(newProperties: any[]): boolean {
  if (!isBrowser) return false

  try {
    // Get existing properties
    const properties = loadFromStorage<any[]>("properties", [])

    // Add new properties
    const updatedProperties = [...properties, ...newProperties]

    // Save back to storage
    return saveToStorage("properties", updatedProperties)
  } catch (error) {
    console.error("Error adding properties:", error)
    return false
  }
}

// Get all properties
export function getAllProperties(): any[] {
  return loadFromStorage<any[]>("properties", [])
}

// Delete a property from storage
export function deleteProperty(id: string) {
  try {
    const properties = getLocalStorage("properties") || []
    const updatedProperties = properties.filter((property: any) => property.id !== id)
    return setLocalStorage("properties", updatedProperties)
  } catch (error) {
    console.error("Error deleting property:", error)
    return false
  }
}

// Add a developer to storage
export function addDeveloper(developer: any): boolean {
  if (!isBrowser) return false

  try {
    const developers = loadFromStorage<any[]>("realEstateDeveloperDetails", [])
    const updatedDevelopers = [...developers, developer]
    return saveToStorage("realEstateDeveloperDetails", updatedDevelopers)
  } catch (error) {
    console.error("Error adding developer:", error)
    return false
  }
}

// Update a developer in storage
export function updateDeveloper(updatedDeveloper: any): boolean {
  if (!isBrowser) return false

  try {
    const developers = loadFromStorage<any[]>("realEstateDeveloperDetails", [])
    const updatedDevelopers = developers.map((developer) =>
      developer.id === updatedDeveloper.id ? updatedDeveloper : developer,
    )
    return saveToStorage("realEstateDeveloperDetails", updatedDevelopers)
  } catch (error) {
    console.error("Error updating developer:", error)
    return false
  }
}

// Delete a developer from storage
export function deleteDeveloper(id: string): boolean {
  if (!isBrowser) return false

  try {
    const developers = loadFromStorage<any[]>("realEstateDeveloperDetails", [])
    const updatedDevelopers = developers.filter((developer) => developer.id !== id)
    return saveToStorage("realEstateDeveloperDetails", updatedDevelopers)
  } catch (error) {
    console.error("Error deleting developer:", error)
    return false
  }
}

// Add a project to storage
export function addProject(project: any): boolean {
  if (!isBrowser) return false

  try {
    const projects = loadFromStorage<any[]>("projects", [])
    const updatedProjects = [...projects, project]
    return saveToStorage("projects", updatedProjects)
  } catch (error) {
    console.error("Error adding project:", error)
    return false
  }
}

// Update a project in storage
export function updateProject(updatedProject: any): boolean {
  if (!isBrowser) return false

  try {
    const projects = loadFromStorage<any[]>("projects", [])
    const updatedProjects = projects.map((project) => (project.id === updatedProject.id ? updatedProject : project))
    return saveToStorage("projects", updatedProjects)
  } catch (error) {
    console.error("Error updating project:", error)
    return false
  }
}

// Delete a project from storage
export function deleteProject(id: string): boolean {
  if (!isBrowser) return false

  try {
    const projects = loadFromStorage<any[]>("projects", [])
    const updatedProjects = projects.filter((project) => project.id !== id)
    return saveToStorage("projects", updatedProjects)
  } catch (error) {
    console.error("Error deleting project:", error)
    return false
  }
}
