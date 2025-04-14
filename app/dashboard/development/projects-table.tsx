"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { EditProjectDialog } from "./edit-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"

interface Project {
  name: string
  developerName: string
  location: string
  totalUnits: number
}

export function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [deleteProject, setDeleteProject] = useState<Project | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadProjects()
  }, [])

  const loadProjects = () => {
    setIsLoading(true)
    try {
      const savedProjects = localStorage.getItem("projects")
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects)
        if (Array.isArray(parsedProjects)) {
          setProjects(parsedProjects)
        } else {
          setProjects([])
        }
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error("Error loading projects:", error)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectUpdated = () => {
    loadProjects()
  }

  // Don't render anything until we're on the client
  if (!isClient) {
    return <div>Loading projects...</div>
  }

  if (isLoading) {
    return <div>Loading projects...</div>
  }

  return (
    <div>
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
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No projects found
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.name}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.developerName}</TableCell>
                <TableCell>{project.location}</TableCell>
                <TableCell>{project.totalUnits}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditProject(project)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteProject(project)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editProject && (
        <EditProjectDialog
          project={editProject}
          open={!!editProject}
          onOpenChange={(open) => {
            if (!open) setEditProject(null)
          }}
          onProjectUpdated={handleProjectUpdated}
        />
      )}

      {deleteProject && (
        <DeleteProjectDialog
          project={deleteProject}
          open={!!deleteProject}
          onOpenChange={(open) => {
            if (!open) setDeleteProject(null)
          }}
          onProjectDeleted={handleProjectUpdated}
        />
      )}
    </div>
  )
}
