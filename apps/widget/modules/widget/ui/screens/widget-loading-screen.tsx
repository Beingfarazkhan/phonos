import { Hand, Loader } from "lucide-react"
import { WidgetHeader } from "../components/widget-header"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atom"
import { useEffect, useState } from "react"
import { useAction, useMutation } from "convex/react"
import { api } from "@workspace/backend/_generated/api"


type InitStep = "org" | "session" | "settings" | "vapi" | "done"

export const WidgetLoadingScreen = ({ organizationId }: { organizationId: string | null }) => {


    const [step, setStep] = useState<InitStep>("org")
    const [sessionValid, setSessionValid] = useState(false)

    const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom)
    const setErrorMessage = useSetAtom(errorMessageAtom)
    const setOrganizationId = useSetAtom(organizationIdAtom)
    const setScreen = useSetAtom(screenAtom)

    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))

    // Step 1) Validate Organization ID
    const validateOrganization = useAction(api.public.organizations.validate)

    // Org Step 
    useEffect(() => {
        if (step !== "org") {
            return
        }

        setLoadingMessage("Loading Organization...")

        if (!organizationId) {
            setErrorMessage("Organization Id is required!")
            setScreen("error")
            return
        }

        setLoadingMessage("Verifying Organization...")

        validateOrganization({ organizationId })
            .then((result) => {
                if (result.valid) {
                    setOrganizationId(organizationId)
                    setLoadingMessage("Organization Verified...")
                    setStep("session")

                } else {
                    setErrorMessage(result.reason || "Invalid Configuration")
                    setScreen("error")
                }
            })
            .catch(() => {
                setErrorMessage("Unable to verify organization.")
                setScreen("error")
            })


    }, [step, setStep, organizationId, setErrorMessage, setOrganizationId, setLoadingMessage, setScreen, validateOrganization,])

    // Step 2) Validate Session

    // Session Step
    const validateContactSession = useMutation(api.public.contactSessions.validate)
    useEffect(() => {
        if (step !== "session") {
            return
        }
        console.log("session usefeect")

        setLoadingMessage('Finding Contact Session Id...')

        if (!contactSessionId) {
            setSessionValid(false)
            setStep("done")
            return
        }

        setLoadingMessage('Validating Session Id...')
        validateContactSession({
            contactSessionId: contactSessionId
        })
            .then((result) => {
                setSessionValid(result.valid)
                setStep("done")
            })
            .catch(() => {
                setSessionValid(false)
                setStep("done")
            })

    }, [step, setStep, loadingMessage, setLoadingMessage])


    // done step
    useEffect(() => {
        if (step !== "done") {
            return
        }

        const hasValidSession = contactSessionId && sessionValid
        setScreen(hasValidSession ? "selection" : "auth")

    }, [step, contactSessionId, sessionValid, setScreen])


    return (
        <>
            <WidgetHeader className="rounded-b-2xl">
                <div className="flex flex-col justify-between gap-y-2 px-3 py-6 font-semibold text-secondary">
                    <p className="text-3xl ">Hi There <Hand className="inline" /></p>
                    <p className="text-lg">Let&apos;s Get You Started</p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col justify-center items-center gap-y-5 p-5 text-muted-foreground">
                <Loader size={50} className="animate-spin-slow" />
                <p>{loadingMessage || "Loading..."}</p>
            </div>

        </>
    )
}