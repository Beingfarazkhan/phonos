import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@workspace/ui/components/resizable'
import { ReactNode } from 'react'
import { ConversationsPanel } from '../components/conversations-panel'

export const ConversationsLayout = ({ children }: { children: ReactNode }) => {

    return (
        <ResizablePanelGroup className='h-full flex-1' direction='horizontal'>
            <ResizablePanel defaultSize={30} maxSize={30} minSize={20}>
                <ConversationsPanel />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={70}>
                {children}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}