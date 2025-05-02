"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectsTable } from "./projects-table"
import { DevelopersTable } from "./developers-table"
import { AddProjectDialog } from "./add-project-dialog"
import { AddDeveloperDialog } from "./add-developer-dialog"
import { Plus } from "lucide-react"

export default function DevelopmentClientWrapper() {
  const [activeTab, setActiveTab] = useState("projects")
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false)
  const [isAddDeveloperDialogOpen, setIsAddDeveloperDialogOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [developers, setDevelopers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setIsLoading(true)
    try {
      // Load projects
      const savedProjects = localStorage.getItem("projects")
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects))
      } else {
        setProjects([])
      }

      // Load developers
      const savedDevelopers = localStorage.getItem("realEstateDeveloperDetails")
      if (savedDevelopers) {
        setDevelopers(JSON.parse(savedDevelopers))
      } else {
        setDevelopers([])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProject = (project: any) => {
    const updatedProjects = [...projects, project]
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))
    setIsAddProjectDialogOpen(false)
  }

  const handleAddDeveloper = (developer: any) => {
    const updatedDevelopers = [...developers, developer]
    setDevelopers(updatedDevelopers)
    localStorage.setItem("realEstateDeveloperDetails", JSON.stringify(updatedDevelopers))
    setIsAddDeveloperDialogOpen(false)
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Development</h1>
          <p className="text-muted-foreground">Manage your projects and developers</p>
        </div>
        <div className="flex gap-2">
          {activeTab === "projects" ? (
            <Button onClick={() => setIsAddProjectDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          ) : (
            <Button onClick={() => setIsAddDeveloperDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Developer
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
              ) : (
                <ProjectsTable />
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
              ) : (
                <DevelopersTable />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddProjectDialog
        open={isAddProjectDialogOpen}
        onOpenChange={setIsAddProjectDialogOpen}
        onAddProject={handleAddProject}
      />

      <AddDeveloperDialog
        open={isAddDeveloperDialogOpen}
        onOpenChange={setIsAddDeveloperDialogOpen}
        onAddDeveloper={handleAddDeveloper}
      />
    </div>
  )
}
