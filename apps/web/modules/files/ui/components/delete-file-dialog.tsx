import { useState } from 'react'
import { api } from '@workspace/backend/_generated/api'
import { useAction, useMutation } from 'convex/react'
import { PublicFile } from '@workspace/backend/private/files'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle
} from '@workspace/ui/components/dialog'

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState
} from '@workspace/ui/components/dropzone'

import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Button } from '@workspace/ui/components/button'

type DeleteFileDialogProps = {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  file: PublicFile | null,
  onFileDelete?: () => void
}

export const DeleteFileDialog = ({
  open,
  onOpenChange,
  file,
  onFileDelete
}: DeleteFileDialogProps) => {

  const deleteFile = useMutation(api.private.files.deleteFile)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleFileDelete = async () => {
    if (!file) {
      return
    }
    setIsDeleting(true)

    try {
      await deleteFile({
        entryId: file?.id
      })
      onFileDelete?.()
      onOpenChange(false)
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            Delete Document
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this file? This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {file && (
          <div className="py-4">
            <div className="rounded-lg bg-muted/50 border p-4">
              <p className='font-medium'>{file.name}</p>
              <p className='text-muted-foreground text-sm'>
                Type: {file.type.toUpperCase()} | Size: {file.size}
              </p>
            </div>

          </div>
        )}

        <DialogFooter>
          <Button
            disabled={isDeleting}
            variant={"outline"}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={isDeleting || !file}
            variant={"destructive"}
            onClick={handleFileDelete}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}