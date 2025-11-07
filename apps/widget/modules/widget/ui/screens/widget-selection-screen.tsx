import { ChevronRightIcon, ChevronsRightIcon, Hand, MessageSquareIcon, MessageSquareTextIcon, TriangleAlertIcon } from "lucide-react"
import { WidgetHeader } from "../components/widget-header"
import { useAtomValue, useSetAtom } from "jotai"
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atom"
import { Button } from "@workspace/ui/components/button"
import { useMutation } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { useState } from "react"
import { WidgetFooter } from "../components/widget-footer"

export const WidgetSelectionScreen = () => {

    const [isPending, setIsPending] = useState(false)

    const organizationId = useAtomValue(organizationIdAtom)
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))

    const setScreen = useSetAtom(screenAtom)
    const setError = useSetAtom(errorMessageAtom)
    const setConversationId = useSetAtom(conversationIdAtom)

    const createConversation = useMutation(api.public.conversations.create)


    const handleCreateNewConversations = async () => {
        if (!organizationId) {
            setError("Missing organization id...")
            setScreen("error")
            return
        }

        if (!contactSessionId) {
            setScreen("auth")
            return
        }
        setIsPending(true)

        try {
            const { conversationId } = await createConversation({
                organizationId: organizationId,
                contactSessionId: contactSessionId,
            })
            setConversationId(conversationId)
            setScreen("chat")
        } catch {
            setScreen("auth")
        } finally {
            setIsPending(false)
        }

    }

    return (
        <>
            <WidgetHeader className="rounded-b-2xl">
                <div className="flex flex-col justify-between gap-y-2 px-3 py-6 font-semibold text-secondary">
                    <p className="text-3xl ">Hi There <Hand className="inline" /></p>
                    <p className="text-lg">Let&apos;s Get You Started</p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col gap-y-5 p-5 ">
                <Button
                    className="w-full justify-between h-16"
                    variant={"outline"}
                    onClick={handleCreateNewConversations}
                    disabled={isPending}
                >
                    <div className="flex items-center gap-x-2">
                        <MessageSquareTextIcon size={5} />
                        <p>Start Chat</p>
                    </div>
                    <ChevronRightIcon size={5} />
                </Button>
            </div>
            {/* <WidgetFooter /> */}
        </>
    )
}