import { Hand, TriangleAlertIcon } from "lucide-react"
import { WidgetHeader } from "../components/widget-header"
import { useAtomValue } from "jotai"
import { errorMessageAtom } from "../../atoms/widget-atom"

export const WidgetErrorScreen = () => {
    const error = useAtomValue(errorMessageAtom)
    return (
        <>
            <WidgetHeader className="rounded-b-2xl">
                <div className="flex flex-col justify-between gap-y-2 px-3 py-6 font-semibold text-secondary">
                    <p className="text-3xl ">Hi There <Hand className="inline" /></p>
                    <p className="text-lg">Let&apos;s Get You Started</p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col justify-center items-center gap-y-5 p-5 text-muted-foreground">
                <TriangleAlertIcon size={50} />
                <p>{error || "Invalid Configuration!"}</p>
            </div>

        </>
    )
}