"use client"

import { useVapiAssistants } from '../../hooks/use-vapi-data'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableFooter,
  TableHead
} from '@workspace/ui/components/table'

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"
import { BotIcon, CheckCircle, PhoneIcon, XCircleIcon } from "lucide-react"


export const VapiAssistantsTab = () => {

  const { data: assistants, isLoading } = useVapiAssistants()

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="border-t bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">
              Assistant
            </TableHead>
            <TableHead className="px-6 py-4">
              Model
            </TableHead>
            <TableHead className="px-6 py-4">
              First Message
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell colSpan={3} className="px-6 py-8 text-muted-foreground">
                    Loading Assistants...
                  </TableCell>
                </TableRow>
              )
            }
            if (assistants.length === 0) {
              return (
                <TableRow>
                  <TableCell colSpan={3} className="px-6 py-8 text-muted-foreground">
                    No Assistants Configured
                  </TableCell>
                </TableRow>
              )
            }

            return assistants.map((assistant) => (
              <TableRow className="hover:bg-muted/50" key={assistant.id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <BotIcon className="size-4 text-muted-foreground" />
                    <span className="font-mono">{assistant.name || 'Unnamed Assistant'}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {assistant.model?.model || 'Not Configured'}
                </TableCell>
                <TableCell className="max-w-xs px-6 py-4">
                  <p className='truncate text-sm text-muted-foreground'>
                    {assistant.firstMessage || "No Greetings Configured"}
                  </p>
                </TableCell>

              </TableRow>
            ))

          })()}
        </TableBody>
      </Table>
    </div>
  )
}