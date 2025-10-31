import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@workspace/backend/_generated/api'
import { Doc } from '@workspace/backend/_generated/dataModel'

import { useMutation } from 'convex/react'
import { Form, FormField, FormLabel, FormControl, FormItem, FormMessage, FormDescription } from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'

import { WidgetHeader } from "@/modules/widget/ui/components/widget-header"
import { Hand } from "lucide-react"


const formSchema = z.object({
    name: z.string().min(1, "Name is required!"),
    email: z.string().email("Invalid email address!")
})

// Sample organization id will be changed after sometime
const organizationId = "12345"

export const WidgetAuthScreen = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: ""
        }
    })

    const createContactSessions = useMutation(api.public.contactSessions.create)

    const submitHandler = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        // await new Promise((resolve) => setTimeout(resolve, 5000))
        form.reset({ name: '', email: '' })

        const metadata: Doc<"contactSessions">["metadata"] = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages.join(""),
            platform: navigator.platform,
            vendor: navigator.vendor,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            cookiesEnabled: navigator.cookieEnabled,
            referrer: document.referrer || "direct",
            currentUrl: window.location.href
        }

        const sessionId = await createContactSessions({
            ...values,
            organizationId,
            metadata
        })

        console.log({ sessionId })
    }

    return (
        <>
            <WidgetHeader className="rounded-b-2xl">
                <div className="flex flex-col justify-between gap-y-2 px-3 py-6 font-semibold text-secondary">
                    <p className="text-3xl ">Hi There <Hand className="inline" /></p>
                    <p className="text-lg">Let&apos;s Get You Started</p>
                </div>
            </WidgetHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitHandler)} className='flex flex-col flex-1 gap-y-4 p-6 mt-10'>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g John Doe"

                                        type="text"
                                        {...field} />
                                </FormControl>
                                <FormDescription className='text-muted-foreground'>What should we call you...</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. user@email.com"

                                        type=""
                                        {...field} />
                                </FormControl>
                                <FormDescription className='text-muted-foreground'>Your email id to contact you...</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting} className='mt-4'>{form.formState.isSubmitting ? 'Submitting...' : 'Submit'}</Button>
                </form>
            </Form>
        </>
    )
}