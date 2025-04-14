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

interface DeleteDeveloperDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleteDeveloper: () => void
  developer: any | null
  hasProjects: boolean
}

export function DeleteDeveloperDialog({
  open,
  onOpenChange,
  onDeleteDeveloper,
  developer,
  hasProjects,
}: DeleteDeveloperDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Developer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this developer? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {hasProjects && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This developer has associated projects. Deleting this developer may affect those projects.
            </AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          {developer && (
            <div className="space-y-2">
              <p>
                <strong>Developer Name:</strong> {developer.name}
              </p>
              <p>
                <strong>Contact Person:</strong> {developer.contactPerson}
              </p>
              <p>
                <strong>Email:</strong> {developer.email}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDeleteDeveloper}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
