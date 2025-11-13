"use client"
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useQuery, useMutation, useAction } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import { useThreadMessages, toUIMessages } from '@convex-dev/agent/react'
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";

// AI Components
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputTools,
  AIInputToolbar
} from '@workspace/ui/components/ai/input'

import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton
} from '@workspace/ui/components/ai/conversation'

import {
  AIMessage,
  AIMessageContent
} from '@workspace/ui/components/ai/message'

import {
  AIResponse
} from '@workspace/ui/components/ai/response'


// Form Components
import { Form, FormField } from '@workspace/ui/components/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DiceBearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { ConversationStatusButton } from "../components/conversation-status-button";
import { useState } from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";


const formSchema = z.object({
  message: z.string().min(1, "Message is required")
})

export const ConversationIdView = ({ conversationId }: { conversationId: Id<"conversations"> }) => {

  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId
  })


  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ?
      {
        threadId: conversation?.threadId
      }
      :
      "skip",
    {
      initialNumItems: 10
    }
  )

  const { isLoadingMore, canLoadMore, handleLoadMore, topElementRef } = useInfiniteScroll({
    status: messages.status,
    loadMore: messages.loadMore,
    loadSize: 10
  })

  const createMessage = useMutation(api.private.messages.create)

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      message: ""
    },
    resolver: zodResolver(formSchema)
  })

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        conversationId,
        prompt: values.message
      })
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  const [updatingStatus, setUpdatingStatus] = useState(false)
  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus
  )
  const handleStatusToggle = async () => {
    if (!conversation) {
      return
    }

    setUpdatingStatus(true)

    let newStatus: "unresolved" | "escalated" | "resolved"

    if (conversation.status === "escalated") {
      newStatus = "resolved"
    } else if (conversation.status === "unresolved") {
      newStatus = "escalated"
    } else {
      newStatus = "unresolved"
    }

    try {
      await updateConversationStatus({
        conversationId,
        status: newStatus
      })
    } catch (error) {
      console.error(error)
    } finally {
      setUpdatingStatus(false)
    }

  }

  const [isEnhancing, setIsEnhancing] = useState(false)
  const enhanceResponse = useAction(api.private.messages.enhanceResponse)
  const handleEnhanceResponse = async () => {
    try {
      setIsEnhancing(true)
      const response = await enhanceResponse({ prompt: form.getValues("message") })
      form.setValue("message", response)
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnhancing(false)
    }
  }


  if (conversation === undefined || messages.status === "LoadingFirstPage") {
    return <ConversationIdViewLoading />
  }

  return (
    <div className="flex flex-col h-full bg-muted">
      <header className="flex items-center justify-between border-b-2 bg-background p-2.5">
        <Button size={"sm"} variant={"ghost"}>
          <MoreHorizontalIcon />
        </Button>
        {conversation?.status && (
          <ConversationStatusButton disabled={updatingStatus} status={conversation?.status} onClick={handleStatusToggle} />
        )}
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            ref={topElementRef}
            onLoadMore={handleLoadMore}
            noMoreText="Chat Started"
          />
          {toUIMessages(messages.results ?? []).map((message, idx) => (
            <AIMessage key={message.id} from={message.role === "user" ? "assistant" : "user"}>
              <AIMessageContent>
                <AIResponse>{message.text}</AIResponse>
              </AIMessageContent>
              {message.role === "user" && (
                <DiceBearAvatar seed={conversation?.contactSessionId ?? "user"} size={32} />
              )}
            </AIMessage>
          ))}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>
      <div className="p-2">
        <Form {...form} >
          <AIInput onSubmit={form.handleSubmit(handleFormSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting ||
                    isEnhancing
                  }
                  onChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      form.handleSubmit(handleFormSubmit)()
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved" ?
                      "Conversation has been resolved."
                      :
                      "Enter your response as an Operator..."
                  }
                  value={field.value}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton className="mb-2"
                  disabled={
                    conversation?.status === "resolved" ||
                    isEnhancing ||
                    form.formState.isSubmitting ||
                    !form.formState.isValid
                  }
                  onClick={handleEnhanceResponse}
                >
                  <Wand2Icon />
                  {isEnhancing ? 'Enhancing...' : 'Enhance'}
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit
                className="mr-2 mb-2"
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  isEnhancing
                }
                status="ready"
                type="submit"
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  )
}

export const ConversationIdViewLoading = () => {
  return (
    <div className="flex flex-col h-full bg-muted">
      <header className="flex items-center justify-between border-b-2 bg-background p-2.5">
        <Button size={"sm"} variant={"ghost"}>
          <MoreHorizontalIcon />
        </Button>
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          {Array.from({ length: 8 }, (_, idx) => {
            const isUser = idx % 2 == 0
            const widths = ['w-48', 'w-60', 'w-72']
            const width = widths[idx % widths.length]
            return (
              <div key={idx} className={cn(
                'group flex w-full items-end justify-end gap-2 py-2 [&>div]:max-w-[80%]',
                isUser ? 'is-user' : 'is-assistant flex-row-reverse'
              )}>
                <Skeleton className={`h-9 ${width} rounded-lg bg-neutral-200`} />
                <Skeleton className={`size-8 rounded-full bg-neutral-200`} />
              </div>
            )
          })}
        </AIConversationContent>
      </AIConversation>
      <div className="p-2">
        <AIInput>
          <AIInputTextarea disabled placeholder="Enter your response as an Operator..." />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit disabled status="ready" />
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  )
}