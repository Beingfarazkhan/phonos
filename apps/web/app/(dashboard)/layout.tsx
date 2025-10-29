
import { DashBoardLayout } from '@/modules/dashboard/ui/layouts/dashboard-layout'
import React, { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <DashBoardLayout>
            {children}
        </DashBoardLayout>
    )
}

export default Layout
