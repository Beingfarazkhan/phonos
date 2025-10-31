"use client"

import { useVapi } from "@/modules/widget/hooks/use-vapi"

import { WidgetFooter } from "@/modules/widget/ui/components/widget-footer"
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header"
import { Hand } from 'lucide-react'


type WidgetViewProps = {
    organizationId: string
}

export const WidgetView = ({ organizationId }: WidgetViewProps) => {


    return (
        <div className="flex flex-col w-full min-h-screen border bg-card shadow-sm overflow-hidden">
            {/* Header */}
            <WidgetHeader className="rounded-b-2xl">
                <div className="flex flex-col justify-between gap-y-2 px-3 py-6 font-semibold text-secondary">
                    <p className="text-3xl ">Hi There <Hand className="inline" /></p>
                    <p className="text-lg">How can we help you today?</p>
                </div>
            </WidgetHeader>

            {/* Body */}
            <div className="flex-1 p-4">
                Widget Content - {organizationId}
            </div>

            {/* Footer */}
            <WidgetFooter />

        </div>
    )
}


//////////////////////////////////////////////////////////
// const { isConnected,
//         isConnecting,
//         isSpeaking,
//         transcript,
//         startCall,
//         endCall } = useVapi()

//     return (
//         <div className="flex items-center justify-center min-h-svh">
//             <div className="flex flex-col items-center justify-center gap-4">
//                 <h1>Chat Widget - {organizationId}</h1>
//                 <div className="border border-gray-400 w-[50vw] h-[500px] relative p-4 flex flex-col gap-2 bg-gray-800 overflow-y-auto rounded-xl">
//                     {
//                         transcript.map((trc, idx) => {
//                             if (trc.role === 'user') {
//                                 return (
//                                     <p key={idx} className="rounded-lg max-w-[60%] bg-gray-300 p-2 self-end">
//                                         {trc.text}
//                                     </p>
//                                 )
//                             } else {
//                                 return (
//                                     <p key={idx} className="text-white rounded-lg max-w-[60%] bg-gray-900 p-2 self-start">
//                                         {trc.text}
//                                     </p>
//                                 )
//                             }
//                         })
//                     }
//                 </div>
//                 <div className="flex flex-row w-[50vw] items-center justify-between">
//                     <Button className="w-[40%] cursor-pointer" onClick={() => startCall()}>Start</Button>
//                     <Button className="w-[40%] cursor-pointer" variant={'destructive'} onClick={() => endCall()}>End</Button>
//                 </div>
//             </div>
//         </div>
//     )