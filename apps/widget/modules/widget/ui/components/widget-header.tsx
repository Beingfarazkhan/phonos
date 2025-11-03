import { cn } from "@workspace/ui/lib/utils"
import { ReactNode } from "react"

export const WidgetHeader = ({ children, className }: { children: ReactNode, className?: string }) => {
    return (
        <header className={cn(
            "bg-secondary-foreground text-secondary",
            className
        )}>
            {children}
        </header>
    )
}