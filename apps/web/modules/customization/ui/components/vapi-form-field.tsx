import { UseFormReturn, useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"


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
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue
} from '@workspace/ui/components/select'

import { FormSchema } from "./customization-form"
import { useVapiAssistants, useVapiPhoneNumbers } from "@/modules/plugins/hooks/use-vapi-data"

type VapiFormFieldsProps = {
  form: UseFormReturn<FormSchema>,
}

export const VapiFormFields = ({
  form,
}: VapiFormFieldsProps) => {
  const { data: assistants, isLoading: assistantsLoading } = useVapiAssistants()
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } = useVapiPhoneNumbers()

  const disabled = form.formState.isSubmitting

  return (
    <>
      <FormField
        control={form.control}
        name="vapiSettings.assistantId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Assistants</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={assistantsLoading || disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={assistantsLoading ? 'Loading assistants...' : 'Select an assistant'}
                  />
                </SelectTrigger>

              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {assistants.map((assistant) => (
                  <SelectItem
                    key={assistant.id}
                    value={assistant.id}
                  >
                    {assistant.name || "Unnamed Assistant"} - {" "} {assistant.model?.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The Vapi assistant you want to use for your voice calls
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vapiSettings.phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vapi Phone Number</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={assistantsLoading || disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={phoneNumbersLoading ? 'Loading Phone Numbers...' : 'Select a Phone Number'}
                  />
                </SelectTrigger>

              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {phoneNumbers.map((phoneNumber) => (
                  <SelectItem
                    key={phoneNumber.id}
                    value={phoneNumber.number || phoneNumber.id}
                  >
                    {phoneNumber.number || "Unknown"} - {" "} {phoneNumber.name || "Unnamed"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The phone number you want to display in the widget
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>

  )
}