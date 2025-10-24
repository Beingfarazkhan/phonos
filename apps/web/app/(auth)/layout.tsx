import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout"
import { ReactNode } from "react"
const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    )
}

export default Layout