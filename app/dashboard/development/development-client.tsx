"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DevelopmentClient() {
  const [developers, setDevelopers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true)

        // Load developers
        const savedDevelopers = localStorage.getItem("realEstateDeveloperDetails")
        if (savedDevelopers) {
          setDevelopers(JSON.parse(savedDevelopers))
        } else {
          setDevelopers([])
        }

        // Load projects
        const savedProjects = localStorage.getItem("projects")
        if (savedProjects) {
          setProjects(JSON.parse(savedProjects))
        } else {
          setProjects([])
        }

        setError(null)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load developers and projects. Please try again.")
        setDevelopers([])
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Development</h1>
        <p className="text-muted-foreground">Manage your projects and developers</p>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="developers">Developers</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage your real estate projects</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10">
                  <p className="text-muted-foreground mb-4">No projects found</p>
                  <Button>Add Project</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id || project.name} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">Developer: {project.developerName}</p>
                        </div>
                      </div>
                      {(project.location || project.totalUnits) && (
                        <div className="mt-2 text-sm">
                          {project.location && <p>Location: {project.location}</p>}
                          {project.totalUnits && <p>Total Units: {project.totalUnits}</p>}
                        </div>
                      )}
                      {project.description && <p className="mt-2 text-sm">{project.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="developers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Developers</CardTitle>
              <CardDescription>Manage your real estate developers</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading developers...</p>
                </div>
              ) : developers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10">
                  <p className="text-muted-foreground mb-4">No developers found</p>
                  <Button>Add Developer</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {developers.map((developer) => (
                    <div key={developer.id || developer.name} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{developer.name}</h3>
                          {developer.contactPerson && (
                            <p className="text-sm text-muted-foreground">Contact: {developer.contactPerson}</p>
                          )}
                        </div>
                      </div>
                      {developer.email && <p className="mt-1 text-sm">Email: {developer.email}</p>}
                      {developer.phone && <p className="mt-1 text-sm">Phone: {developer.phone}</p>}
                      {developer.description && <p className="mt-2 text-sm">{developer.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
