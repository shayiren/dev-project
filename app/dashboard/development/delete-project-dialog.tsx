"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectDeleted: () => void
  project: any | null
}

export function DeleteProjectDialog({ open, onOpenChange, onProjectDeleted, project }: DeleteProjectDialogProps) {
  const handleDelete = () => {
    if (!project) return

    // Get existing projects from localStorage
    const savedProjects = localStorage.getItem("projects")
    const projects = savedProjects ? JSON.parse(savedProjects) : []

    // Remove the project
    const updatedProjects = projects.filter((proj: any) => proj.name !== project.name)

    // Save back to localStorage
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // Notify parent component
    onProjectDeleted()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {project && (
            <div className="space-y-2">
              <p>
                <strong>Project Name:</strong> {project.name}
              </p>
              <p>
                <strong>Developer:</strong> {project.developerName}
              </p>
              <p>
                <strong>Location:</strong> {project.location}
              </p>
              <p>
                <strong>Total Units:</strong> {project.totalUnits}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
