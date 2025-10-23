import { ReactNode } from "react"
const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen min-w-screen flex flex-col justify-center items-center">
            {children}
        </div>
    )
}

export default Layout