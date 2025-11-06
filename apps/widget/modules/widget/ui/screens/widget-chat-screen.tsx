"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon, ChevronRightIcon, Hand, MenuIcon, MessageSquareTextIcon } from "lucide-react"
import { WidgetHeader } from "../components/widget-header"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atom"
import { useAction, useQuery } from "convex/react"
import { useThreadMessages, toUIMessages } from '@convex-dev/agent/react'

import { api } from "@workspace/backend/_generated/api"

import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll"
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger"
import { Button } from "@workspace/ui/components/button"
import { Form, FormField } from "@workspace/ui/components/form"
import { DiceBearAvatar } from "@workspace/ui/components/dicebear-avatar"

import {
    AIConversation,
    AIConversationContent,
    AIConversationScrollButton,
} from '@workspace/ui/components/ai/conversation'

import {
    AIMessage,
    AIMessageContent
} from '@workspace/ui/components/ai/message'

import {
    AIResponse
} from '@workspace/ui/components/ai/response'

import {
    AIInput,
    AIInputSubmit,
    AIInputTextarea,
    AIInputToolbar,
    AIInputTools
} from '@workspace/ui/components/ai/input'
import { useForm } from "react-hook-form"
import { fi } from "zod/v4/locales"

const formSchema = z.object({
    message: z.string().min(1, "Message is required.")
})


export const WidgetChatScreen = () => {

    const organizationId = useAtomValue(organizationIdAtom)
    const [conversationId, setConversationId] = useAtom(conversationIdAtom)
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))
    const setScreen = useSetAtom(screenAtom)

    const goToSelection = () => {
        setConversationId(null)
        setScreen("selection")
    }

    const conversation = useQuery(
        api.public.conversations.getOne,
        conversationId && contactSessionId ?
            {
                contactSessionId,
                conversationId
            }
            :
            "skip"
    )

    const messages = useThreadMessages(
        api.public.messages.getMany,
        conversation?.threadId && contactSessionId ?
            {
                contactSessionId,
                threadId: conversation.threadId
            }
            :
            "skip",
        { initialNumItems: 10 }
    )

    const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
        status: messages.status,
        loadMore: messages.loadMore,
        loadSize: 10
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: ""
        }
    })

    const submitHandler = async (values: z.infer<typeof formSchema>) => {
        if (!conversation || !contactSessionId) {
            return
        }

        form.reset()

        await createMessage({
            threadId: conversation.threadId,
            prompt: values.message,
            contactSessionId,
        })
    }

    const createMessage = useAction(api.public.messages.create)

    return (
        <>
            <WidgetHeader className="rounded-b-2xl p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-2">
                        <Button size={"icon"} variant={"ghost"} onClick={goToSelection}>
                            <ArrowLeftIcon />
                        </Button>
                        <p >Chat</p>
                    </div>
                    <Button size={"icon"} variant={"ghost"}>
                        <MenuIcon />
                    </Button>
                </div>
            </WidgetHeader>
            <AIConversation>
                <AIConversationContent>
                    <InfiniteScrollTrigger
                        canLoadMore={canLoadMore}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={handleLoadMore}
                        ref={topElementRef}

                    />
                    {toUIMessages(messages.results ?? [])?.map((message) => {
                        return (
                            <AIMessage

                                from={message.role === "user" ? "user" : "assistant"}
                                key={message.id}
                            >
                                <AIMessageContent>
                                    <AIResponse>{message.text}</AIResponse>
                                </AIMessageContent>
                                {message.role === "assistant" && (
                                    <DiceBearAvatar
                                        size={32}
                                        seed="assistant"
                                        imageUrl="/phonos.svg"
                                    />
                                )}

                            </AIMessage>
                        )
                    })}
                </AIConversationContent>
            </AIConversation>

            <Form {...form}>
                <AIInput
                    className="rounded-none border-x-0 border-b-0"
                    onSubmit={form.handleSubmit(submitHandler)}
                >
                    <FormField
                        control={form.control}
                        name="message"
                        disabled={conversation?.status === "resolved"}
                        render={({ field }) => (
                            <AIInputTextarea
                                disabled={conversation?.status === "resolved"}
                                onChange={field.onChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        form.handleSubmit(submitHandler)()
                                    }
                                }}
                                placeholder={conversation?.status === "resolved" ?
                                    "This conversation has been resolved."
                                    :
                                    "Type your message..."
                                }
                                value={field.value}
                            />
                        )}
                    />
                    <AIInputToolbar>
                        <AIInputTools />
                        <AIInputSubmit
                            disabled={conversation?.status === "resolved" && !form.formState.isValid && form.formState.isSubmitting}
                            status="ready"
                            type="submit"
                        />
                    </AIInputToolbar>


                </AIInput>
            </Form>

        </>
    )
}