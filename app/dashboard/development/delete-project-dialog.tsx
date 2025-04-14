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
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { loadFromStorage } from "@/utils/storage-utils"

interface DeleteProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleteProject: () => void
  project: any | null
}

export function DeleteProjectDialog({ open, onOpenChange, onDeleteProject, project }: DeleteProjectDialogProps) {
  // Check if there are properties associated with this project
  const hasProperties = () => {
    if (!project) return false

    const properties = loadFromStorage("properties", [])
    return properties.some((property: any) => property.projectName === project.name)
  }

  const propertiesExist = hasProperties()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {propertiesExist && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This project has associated properties. Deleting this project may affect those properties.
            </AlertDescription>
          </Alert>
        )}

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
          <Button variant="destructive" onClick={onDeleteProject}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
