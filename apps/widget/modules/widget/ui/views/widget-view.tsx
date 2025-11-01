"use client"

import { useAtomValue } from "jotai"
import { screenAtom } from "../../atoms/widget-atom"
import { WidgetAuthScreen } from "../screens/widget-auth-screen"

type WidgetViewProps = {
    organizationId: string
}

export const WidgetView = ({ organizationId }: WidgetViewProps) => {

    const screen = useAtomValue(screenAtom)

    const screenComponents = {
        "error": <p>Error</p>,
        "loading": <p>Loading</p>,
        "selection": <p>Selection</p>,
        "voice": <p>Voice</p>,
        "auth": <WidgetAuthScreen />,
        "inbox": <p>Inbox</p>,
        "chat": <p>Chat</p>,
        "contact": <p>Contact</p>
    }

    return (
        <div className="flex flex-col w-full min-h-screen border bg-card shadow-sm overflow-hidden">
            {screenComponents[screen]}
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