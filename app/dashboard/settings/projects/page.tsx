"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Pencil, Trash2 } from "lucide-react"

// Define the Project type
interface Project {
  id: string
  name: string
  developerName: string
  description: string
  location: string
  totalUnits: number
}

export default function ProjectsPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  // Load projects from localStorage on initial render
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem("realEstateProjectDetails")
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects)
        if (Array.isArray(parsed)) {
          setProjects(parsed)
        } else {
          setProjects([])
        }
      }
    } catch (error) {
      console.error("Error loading projects:", error)
      setProjects([])
    }
  }, [])

  const handleDeleteProject = (id: string) => {
    setProjectToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      try {
        // Remove from project details
        const updatedProjects = projects.filter((project) => project.id !== projectToDelete)
        setProjects(updatedProjects)
        localStorage.setItem("realEstateProjectDetails", JSON.stringify(updatedProjects))

        // Also update the project list used for dropdowns
        const projectList = updatedProjects.map((project) => ({
          name: project.name,
          developerName: project.developerName,
        }))
        localStorage.setItem("realEstateProjects", JSON.stringify(projectList))

        toast({
          title: "Project deleted",
          description: "The project has been successfully deleted.",
        })
      } catch (error) {
        console.error("Error deleting project:", error)
        toast({
          title: "Error",
          description: "Failed to delete the project.",
          variant: "destructive",
        })
      }

      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground">Manage your real estate projects</p>
        </div>
        <Link href="/dashboard/settings/projects/details">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <p className="text-muted-foreground mb-4">No projects found</p>
            <Link href="/dashboard/settings/projects/details">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>A list of all your real estate projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Developer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Total Units</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.developerName}</TableCell>
                    <TableCell>{project.location || "N/A"}</TableCell>
                    <TableCell>{project.totalUnits || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/settings/projects/details?id=${project.id}`}>
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteProject(project.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProject} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
