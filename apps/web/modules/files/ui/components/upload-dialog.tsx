import { useState } from 'react'
import { api } from '@workspace/backend/_generated/api'
import { useAction } from 'convex/react'

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

type UploadDialogProps = {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onFileUpload?: () => void
}

export const UploadDialog = ({
  open,
  onOpenChange,
  onFileUpload
}: UploadDialogProps) => {
  const addFile = useAction(api.private.files.addFile)

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedForm, setUploadedForm] = useState({
    category: '',
    fileName: ''
  })

  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]

    if (file) {
      setUploadedFiles([file])
      if (!uploadedForm.fileName) {
        setUploadedForm((prev) => ({ ...prev, fileName: file.name }))
      }
    }
  }

  const handleFileUpload = async () => {
    setIsUploading(true)
    try {
      const blob = uploadedFiles[0]
      if (!blob) {
        return
      }

      const fileName = uploadedForm.fileName || blob.name

      await addFile({
        bytes: await blob.arrayBuffer(),
        fileName,
        mimeType: blob.type || 'text/plain',
        category: uploadedForm.category
      })

      onFileUpload?.()
      handleUploadCancel()

    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadCancel = () => {
    onOpenChange(false)
    setUploadedFiles([])
    setUploadedForm({
      category: '',
      fileName: ''
    })
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            Upload Document
          </DialogTitle>
          <DialogDescription>
            Upload documents to your knowledge base for AI Powered search and retrieval
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor='category'>
              Category
            </Label>
            <Input
              className='w-full'
              id='category'
              onChange={(e) => setUploadedForm((prev) => ({ ...prev, category: e.target.value }))}
              placeholder='e.g Documentation, Support, FAQ...'
              type='text'
              value={uploadedForm.category}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor='fileName'>
              File Name{" "}
              <span className='text-xs text-muted-foreground'>(Optional)</span>
            </Label>
            <Input
              className='w-full'
              id='fileName'
              onChange={(e) => setUploadedForm((prev) => ({ ...prev, fileName: e.target.value }))}
              placeholder='Override default file name...'
              type='text'
              value={uploadedForm.fileName}
            />
          </div>

          <Dropzone
            accept={{
              'application/pdf': ['.pdf'],
              'text/csv': ['.csv'],
              'text/plain': ['.txt'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            }}
            disabled={isUploading}
            maxFiles={1}
            onDrop={handleFileDrop}
            src={uploadedFiles}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>

        <DialogFooter>
          <Button
            disabled={isUploading}
            variant={"destructive"}
            onClick={handleUploadCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={uploadedFiles.length === 0 || isUploading || !uploadedForm.category}
            variant={"transparent"}
            className='bg-secondary-foreground text-white hover:bg-secondary-foreground/90'
            onClick={handleFileUpload}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}