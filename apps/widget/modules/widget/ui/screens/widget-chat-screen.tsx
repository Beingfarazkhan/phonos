import { ArrowLeftIcon, ChevronRightIcon, Hand, MenuIcon, MessageSquareTextIcon } from "lucide-react"
import { WidgetHeader } from "../components/widget-header"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atom"
import { Button } from "@workspace/ui/components/button"
import { useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"


export const WidgetChatScreen = () => {

    const organizationId = useAtomValue(organizationIdAtom)
    const [conversationId, setConversationId] = useAtom(conversationIdAtom)
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))
    const setScreen = useSetAtom(screenAtom)

    const goToSelection = () => {
        setConversationId(null)
        setScreen("selection")
    }

    const converation = useQuery(
        api.public.conversations.getOne,
        conversationId && contactSessionId ?
            {
                contactSessionId,
                conversationId
            }
            :
            "skip"
    )


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
            <div className="flex flex-1 flex-col gap-y-5 p-5 ">
                <p>Chat screen</p>
                <p>{JSON.stringify(converation)}</p>
            </div>

        </>
    )
}