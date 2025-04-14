"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useDevelopers } from "@/hooks/use-developers"

export default function ProjectsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { developers, isLoading, addDeveloper, removeDeveloper } = useDevelopers()
  const [projects, setProjects] = useState<
    Array<{ name: string; developerName: string; description?: string; location?: string; totalUnits?: number }>
  >([])
  const [newDeveloper, setNewDeveloper] = useState("")
  const [newProject, setNewProject] = useState({
    name: "",
    developerName: "",
    description: "",
    location: "",
    totalUnits: "",
  })
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)

  // Load projects from localStorage
  useEffect(() => {
    // Set default projects right away
    const defaultProjects = [
      { name: "Sunset Residences", developerName: "Prime Developers", location: "Dubai Marina", totalUnits: 120 },
      { name: "Ocean View Towers", developerName: "Prime Developers", location: "Palm Jumeirah", totalUnits: 85 },
      { name: "Urban Heights", developerName: "City Builders", location: "Downtown", totalUnits: 200 },
      { name: "Downtown Lofts", developerName: "City Builders", location: "Business Bay", totalUnits: 150 },
      { name: "Metro Gardens", developerName: "Metro Construction", location: "JLT", totalUnits: 180 },
      { name: "City Center Plaza", developerName: "Metro Construction", location: "Deira", totalUnits: 95 },
    ]

    try {
      const savedProjects = localStorage.getItem("projects")
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects)
        if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
          setProjects(parsedProjects)
        } else {
          setProjects(defaultProjects)
          localStorage.setItem("projects", JSON.stringify(defaultProjects))
        }
      } else {
        setProjects(defaultProjects)
        localStorage.setItem("projects", JSON.stringify(defaultProjects))
      }
    } catch (error) {
      console.error("Error parsing projects from localStorage:", error)
      setProjects(defaultProjects)
      localStorage.setItem("projects", JSON.stringify(defaultProjects))
    } finally {
      setIsLoadingProjects(false)
    }
  }, [])

  const handleAddDeveloper = () => {
    if (newDeveloper.trim() === "") {
      toast({
        title: "Error",
        description: "Developer name cannot be empty",
        variant: "destructive",
      })
      return
    }

    const success = addDeveloper(newDeveloper.trim())

    if (success) {
      setNewDeveloper("")
      toast({
        title: "Success",
        description: "Developer added successfully",
      })
    } else {
      toast({
        title: "Error",
        description: "Developer already exists",
        variant: "destructive",
      })
    }
  }

  const handleRemoveDeveloper = (developer: string) => {
    // Check if developer is used in any project
    const isUsed = projects.some((project) => project.developerName === developer)
    if (isUsed) {
      toast({
        title: "Error",
        description: "Cannot remove developer that is used in projects",
        variant: "destructive",
      })
      return
    }

    removeDeveloper(developer)

    toast({
      title: "Success",
      description: "Developer removed successfully",
    })
  }

  const handleAddProject = () => {
    if (newProject.name.trim() === "" || newProject.developerName === "") {
      toast({
        title: "Error",
        description: "Project name and developer are required",
        variant: "destructive",
      })
      return
    }

    if (projects.some((p) => p.name === newProject.name.trim())) {
      toast({
        title: "Error",
        description: "Project with this name already exists",
        variant: "destructive",
      })
      return
    }

    const projectToAdd = {
      name: newProject.name.trim(),
      developerName: newProject.developerName,
      description: newProject.description,
      location: newProject.location,
      totalUnits: newProject.totalUnits ? Number.parseInt(newProject.totalUnits) : undefined,
    }

    const updatedProjects = [...projects, projectToAdd]
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    setNewProject({
      name: "",
      developerName: "",
      description: "",
      location: "",
      totalUnits: "",
    })

    toast({
      title: "Success",
      description: "Project added successfully",
    })
  }

  const handleRemoveProject = (projectName: string) => {
    // Check if project is used in any property
    const savedProperties = localStorage.getItem("properties")
    if (savedProperties) {
      try {
        const parsedProperties = JSON.parse(savedProperties)
        const isUsed = parsedProperties.some((p: any) => p.projectName === projectName)
        if (isUsed) {
          toast({
            title: "Error",
            description: "Cannot remove project that is used in properties",
            variant: "destructive",
          })
          return
        }
      } catch (error) {
        console.error("Error parsing properties from localStorage:", error)
      }
    }

    const updatedProjects = projects.filter((p) => p.name !== projectName)
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    toast({
      title: "Success",
      description: "Project removed successfully",
    })
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Projects & Developers</h1>
        <Button onClick={() => router.push("/dashboard/projects/add")}>Add New Project</Button>
      </div>

      <Tabs defaultValue="developers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="developers">Developers</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="developers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Developer</CardTitle>
              <CardDescription>Add a new developer to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="newDeveloper">Developer Name</Label>
                  <Input
                    id="newDeveloper"
                    value={newDeveloper}
                    onChange={(e) => setNewDeveloper(e.target.value)}
                    placeholder="Enter developer name"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddDeveloper}>Add Developer</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Developers</CardTitle>
              <CardDescription>Manage your existing developers</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-12 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-12 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-12 bg-muted animate-pulse rounded-md"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {developers.length === 0 ? (
                    <p className="text-muted-foreground">No developers found</p>
                  ) : (
                    developers.map((developer) => (
                      <div key={developer} className="flex justify-between items-center p-3 border rounded-md">
                        <span>{developer}</span>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveDeveloper(developer)}>
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Project</CardTitle>
              <CardDescription>Add a new project to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label htmlFor="projectDeveloper">Developer *</Label>
                  {isLoading ? (
                    <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                  ) : (
                    <select
                      id="projectDeveloper"
                      value={newProject.developerName}
                      onChange={(e) => setNewProject({ ...newProject, developerName: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select Developer</option>
                      {developers.map((developer) => (
                        <option key={developer} value={developer}>
                          {developer}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <Label htmlFor="projectLocation">Location</Label>
                  <Input
                    id="projectLocation"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <Label htmlFor="projectUnits">Total Units</Label>
                  <Input
                    id="projectUnits"
                    type="number"
                    value={newProject.totalUnits}
                    onChange={(e) => setNewProject({ ...newProject, totalUnits: e.target.value })}
                    placeholder="Enter total units"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="projectDescription">Description</Label>
                  <textarea
                    id="projectDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Enter project description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddProject}>Add Project</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Projects</CardTitle>
              <CardDescription>Manage your existing projects</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProjects ? (
                <div className="space-y-4">
                  <div className="h-24 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-24 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-24 bg-muted animate-pulse rounded-md"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <p className="text-muted-foreground">No projects found</p>
                  ) : (
                    projects.map((project) => (
                      <div key={project.name} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-muted-foreground">Developer: {project.developerName}</p>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveProject(project.name)}>
                            Remove
                          </Button>
                        </div>
                        {(project.location || project.totalUnits) && (
                          <div className="mt-2 text-sm">
                            {project.location && <p>Location: {project.location}</p>}
                            {project.totalUnits && <p>Total Units: {project.totalUnits}</p>}
                          </div>
                        )}
                        {project.description && <p className="mt-2 text-sm">{project.description}</p>}
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
