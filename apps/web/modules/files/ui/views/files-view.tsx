"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow
} from '@workspace/ui/components/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'
import { Badge } from '@workspace/ui/components/badge'


import { InfiniteScrollTrigger } from '@workspace/ui/components/infinite-scroll-trigger'
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll'
import { api } from '@workspace/backend/_generated/api'
import { useAction, useMutation, usePaginatedQuery } from 'convex/react'
import { Button } from '@workspace/ui/components/button'
import { FileIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { UploadDialog } from '../components/upload-dialog'
import { useState } from 'react'
import { DeleteFileDialog } from '../components/delete-file-dialog'
import { PublicFile } from '@workspace/backend/private/files'


export const FilesView = () => {

  const addFile = useAction(api.private.files.addFile)
  const deleteFile = useMutation(api.private.files.deleteFile)
  const listFiles = usePaginatedQuery(api.private.files.list, { category: undefined }, { initialNumItems: 10 })

  const { isLoadingMore, isLoadingFirstPage, topElementRef, handleLoadMore, canLoadMore } = useInfiniteScroll({
    status: listFiles.status,
    loadMore: listFiles.loadMore,
    loadSize: 10
  })

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null)


  const handleDeleteClick = (file: PublicFile) => {
    setSelectedFile(file)
    setDeleteDialogOpen(true)
  }

  const handleFileDeleted = () => {
    setSelectedFile(null)
  }

  return (
    <>
      <DeleteFileDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        file={selectedFile}
        onFileDelete={handleFileDeleted}
      />
      <UploadDialog
        onOpenChange={setUploadDialogOpen}
        open={uploadDialogOpen}
      // onFileUpload={addFile}
      />
      <div className='flex min-h-screen flex-col bg-muted p-8'>
        <div className='mx-auto w-full max-w-screen-md'>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">
              Knowledge Base
            </h1>
            <p className='text-muted-foreground'>Upload and manage your documents for your AI Assistant</p>
          </div>
          <div className='mt-8 rounded-lg border bg-background'>
            <div className='flex items-center justify-end border-b px-6 py-4'>
              <Button
                onClick={() => setUploadDialogOpen(true)}
              >
                <PlusIcon />
                Add New
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='px-6 py-4 font-medium'>Name</TableHead>
                  <TableHead className='px-6 py-4 font-medium'>Type</TableHead>
                  <TableHead className='px-6 py-4 font-medium'>Size</TableHead>
                  <TableHead className='px-6 py-4 font-medium'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  if (isLoadingFirstPage) {
                    return (
                      <TableRow>
                        <TableCell className='h-24 text-center' colSpan={4}>
                          Loading Files...
                        </TableCell>
                      </TableRow>
                    )
                  }

                  if (listFiles.results.length === 0) {
                    return (
                      <TableRow>
                        <TableCell className='h-24 text-center' colSpan={4}>
                          No Files Found...
                        </TableCell>
                      </TableRow>
                    )
                  }

                  return listFiles.results.map((file) => (
                    <TableRow className='hover:bg-muted/50' key={file.id}>
                      <TableCell className='px-6 py-4 font-medium'>
                        <div className='flex items-center gap-3'>
                          <FileIcon />
                          {file.name}
                        </div>
                      </TableCell>
                      <TableCell className='px-6 py-4 font-medium'>
                        <Badge className='uppercase' variant={"outline"}>
                          {file.type}
                        </Badge>
                      </TableCell>
                      <TableCell className='px-6 py-4 font-medium text-muted-foreground'>
                        {file.size}
                      </TableCell>
                      <TableCell className='px-6 py-4 font-medium text-muted-foreground'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className='size-8 p-0'
                              size={"sm"}
                              variant={"ghost"}
                            >
                              <MoreHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              className='text-white bg-red-600 hover:bg-red-700 hover:text-white focus:bg-red-700 focus:text-white'
                              onClick={() => handleDeleteClick(file)}
                            >
                              <TrashIcon className='size-4 mr-2 text-white' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                })()}
              </TableBody>
            </Table>
            {!isLoadingFirstPage && listFiles.results.length > 0 && (
              <div className='border-t'>
                <InfiniteScrollTrigger
                  ref={topElementRef}
                  canLoadMore={canLoadMore}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMore}
                  noMoreText='No more files.'
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

// Dummy Data for PublicFile type
const dummyFiles = [
  {
    id: "1a2b3c4d5e",
    name: "Document1.pdf",
    type: "pdf",
    size: "1.2MB",
    status: "ready",
    url: "https://example.com/files/document1.pdf",
    category: "documents"
  },
  {
    id: "6f7g8h9i0j",
    name: "Image1.jpg",
    type: "image/jpeg",
    size: "500KB",
    status: "processing",
    url: null,
    category: "images"
  },
  {
    id: "2k3l4m5n6o",
    name: "Presentation.pptx",
    type: "pptx",
    size: "15MB",
    status: "ready",
    url: "https://example.com/files/presentation.pptx",
  },
  {
    id: "7p8q9r0s1t",
    name: "AudioTrack.mp3",
    type: "audio/mp3",
    size: "3.5MB",
    status: "error",
    url: null,
    category: "audio"
  },
  {
    id: "5u6v7w8x9y",
    name: "Report.docx",
    type: "docx",
    size: "850KB",
    status: "ready",
    url: "https://example.com/files/report.docx",
    category: "documents"
  }
];

console.log(dummyFiles);
