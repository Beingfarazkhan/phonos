"use client"

import { GlobeIcon, PhoneCallIcon, PhoneIcon, WorkflowIcon } from "lucide-react"
import { type Feature, PluginCard } from "../components/plugin-card"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle
} from '@workspace/ui/components/dialog'

import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormDescription,
  FormMessage
} from '@workspace/ui/components/form'

import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"

import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"



const vapiFeatures: Feature[] = [
  {
    icon: GlobeIcon,
    label: "Web Voice Calls",
    description: "Voice chat directly in your app"
  },
  {
    icon: PhoneIcon,
    label: "Phone Numbers",
    description: "Get dedicated business lines"
  },
  {
    icon: PhoneCallIcon,
    label: "Outbound Calls",
    description: "Automated customer outreach"
  },
  {
    icon: WorkflowIcon,
    label: "Workflows",
    description: "Custom conversation flows"
  },
]

const formScema = z.object({
  publicApiKey: z.string().min(1, { message: 'Public Api Key is required.' }),
  privateApiKey: z.string().min(1, { message: 'Private Api Key is required.' })
})

const VapiPluginForm = (
  {
    open,
    setOpen
  }: {
    open: boolean,
    setOpen: (value: boolean) => void
  }
) => {

  const upsertSecret = useMutation(api.private.secrets.upsert)

  const form = useForm<z.infer<typeof formScema>>({
    defaultValues: {
      publicApiKey: '',
      privateApiKey: '',
    },
    resolver: zodResolver(formScema)
  })

  const submitHandler = async (values: z.infer<typeof formScema>) => {
    console.log('Vapi view values\n', values)
    try {
      await upsertSecret({
        service: 'vapi',
        value: {
          publicApiKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        }
      })
      setOpen(false)
      toast.success("VAPI Secret Created.")
    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Vapi</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Your API keys are safely stored and managed by Infisical Secrets Manager.
        </DialogDescription>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(submitHandler)}
          >
            <FormField
              control={form.control}
              name="publicApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label>Public API Key</Label>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      placeholder="Your public API key"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privateApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label>Private API Key</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your private API key"
                      disabled={form.formState.isSubmitting}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Connecting...' : 'Connect'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


export const VapiView = () => {
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: 'vapi' })

  const [connectOpen, setConnectOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)

  const handleSubmit = () => {
    if (vapiPlugin) {
      setRemoveOpen(true)
    } else {
      setConnectOpen(true)
    }
  }

  return (
    <>
      <VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
      <div className="flex flex-col bg-muted min-h-screen p-8">
        <div className="w-full mx-auto max-w-screen-md">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Vapi Plugin</h1>
            <p className="text-muted-foreground">Connect Vapi to enable AI voice calls and phone support.</p>
          </div>
          <div className="mt-8">
            {vapiPlugin ? (
              <p>Vapi Connected</p>
            ) : (
              <PluginCard
                features={vapiFeatures}
                serviceImage="/vapi.svg"
                serviceName="Vapi"
                isDisabled={vapiPlugin === undefined}
                onSubmit={handleSubmit}
              />
            )}

          </div>
        </div>
      </div>
    </>
  )
}