import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"


type ConversationStatusIconProps = {
    status: "unresolved" | "escalated" | "resolved",
    className?: string
}

const statusConfig = {
    resolved: {
        icon: CheckIcon,
        bgColor: 'bg-green-500'
    },
    escalated: {
        icon: ArrowUpIcon,
        bgColor: 'bg-yellow-500'
    },
    unresolved: {
        icon: ArrowRightIcon,
        bgColor: 'bg-red-600'
    },
} as const

export const ConversationStatusIcon = ({
    status,
    className
}: ConversationStatusIconProps) => {
    const config = statusConfig[status]
    const Icon = config.icon

    return (
        <div className={cn(
            "flex items-center justify-center p-1.5 rounded-full",
            config.bgColor,
            className
        )}>
            <Icon className="size-3 stroke-3 text-white" />
        </div>
    )
}