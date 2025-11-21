
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormDescription,
  FormMessage
} from '@workspace/ui/components/form'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle
} from '@workspace/ui/components/card'

import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from '@workspace/ui/components/textarea'
import { Doc } from '@workspace/backend/_generated/dataModel'
import { useMutation } from 'convex/react'
import { api } from '@workspace/backend/_generated/api'
import { Separator } from '@workspace/ui/components/separator'
import { VapiFormFields } from './vapi-form-field'

export const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, 'Greeting message is required.'),
  defaultSuggestion: z.object({
    suggestion1: z.optional(z.string()),
    suggestion2: z.optional(z.string()),
    suggestion3: z.optional(z.string()),
  }),
  vapiSettings: z.object({
    assistantId: z.optional(z.string()),
    phoneNumber: z.optional(z.string())
  })
})

type WidgetSettings = Doc<"widgetSettings">
export type FormSchema = z.infer<typeof widgetSettingsSchema>

type CustomizationFormProps = {
  initialData?: WidgetSettings | null,
  hasVapiPlugin: boolean
}


export const CustomizationForm = ({
  initialData,
  hasVapiPlugin
}: CustomizationFormProps) => {

  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert)

  const form = useForm<FormSchema>({
    defaultValues: {
      greetMessage: initialData?.greetMessage || 'Hi! How can i help you today?',
      defaultSuggestion: {
        suggestion1: initialData?.defaultSuggestion.suggestion1 || "",
        suggestion2: initialData?.defaultSuggestion.suggestion2 || "",
        suggestion3: initialData?.defaultSuggestion.suggestion3 || "",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings.assistantId || "",
        phoneNumber: initialData?.vapiSettings.phoneNumber || "",
      }
    }
  })

  const submitHandler = async (values: FormSchema) => {
    try {
      const vapiSettings: WidgetSettings["vapiSettings"] = {
        assistantId: values.vapiSettings.assistantId === "none" ? "" : values.vapiSettings.assistantId,
        phoneNumber: values.vapiSettings.phoneNumber === "none" ? "" : values.vapiSettings.phoneNumber,
      }
      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggestion: values.defaultSuggestion,
        vapiSettings
      })
      toast.success('Widget settings saved')
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    }
  }

  return (
    <Form {...form} >
      <form className="space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
        <Card>
          <CardHeader>
            <CardTitle>General Chat Settings</CardTitle>
            <CardDescription>
              Configure basic chat widget behaviour and messages
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greet Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Welcome message shown when chat opened'
                      cols={3}
                    />
                  </FormControl>
                  <FormDescription>
                    The first message customers see when they open the chat
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className='mb-4 text-sm'>Default Suggestions</h3>
                <p className='mb-4 text-muted-foreground text-sm'>Quick reply suggestions shown to the customers to help guide the conversation</p>
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="defaultSuggestion.suggestion1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suggestion 1</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='e.g How do i get started?'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultSuggestion.suggestion2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suggestion 2</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='e.g What are your pricing plans?'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultSuggestion.suggestion3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suggestion 3</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='e.g I need help with my account'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

          </CardContent>
        </Card>

        {hasVapiPlugin && (
          <Card>
            <CardHeader>
              <CardTitle>Voice Assistant Settings</CardTitle>
              <CardDescription>
                Configure voice calling settings powered by Vapi
              </CardDescription>
              <CardContent className='space-y-6'>
                <VapiFormFields
                  form={form}
                />
              </CardContent>
            </CardHeader>
          </Card>
        )}

        <div className='flex justify-end'>
          <Button
            disabled={form.formState.isSubmitting}
            type='submit'
          >
            Save Settings
          </Button>
        </div>

      </form>
    </Form>
  )
}