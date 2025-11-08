"use client"

import { ConversationsLayout } from "@/modules/dashboard/ui/layouts/conversations-layout";
import { ReactNode } from "react";


const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <ConversationsLayout>
            {children}
        </ConversationsLayout>
    )
}

export default Layout