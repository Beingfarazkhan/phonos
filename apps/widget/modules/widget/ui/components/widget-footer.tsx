
import { Button } from "@workspace/ui/components/button"
import { Inbox, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"

export const WidgetFooter = () => {
    const [active, setActive] = useState<"home" | "inbox">("home")
    return (
        <div className="relative bg-secondary-foreground rounded-t-2xl h-16 flex items-center justify-around overflow-hidden">
            {/* Animated curved background */}
            <motion.div
                layout
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                }}
                className={cn(
                    "absolute top-0 h-[90%] w-[50vw] bg-card shadow-md",
                    active === "home" ? "left-[0%]" : "left-[50%]",
                    "rounded-b-xl rounded-t-none"
                )}
                style={{
                    translateX: "0%",

                }}
            />

            {/* Buttons (on top of the curved div) */}
            <Button
                size="icon"
                variant="ghost"
                onClick={() => setActive("home")}
                className={cn(
                    "group flex-1 h-full relative z-10 transition-colors duration-300 ",
                    active === "home" ? "text-secondary-foreground" : "text-primary-foreground"
                )}
            >
                <Home className="h-5 w-5 group-hover:scale-110 transition duration-200" />
            </Button>

            <Button
                size="icon"
                variant="ghost"
                onClick={() => setActive("inbox")}
                className={cn(
                    "group flex-1 h-full relative z-10 transition-colors duration-300",
                    active === "inbox" ? "text-secondary-foreground" : "text-primary-foreground"
                )}
            >
                <Inbox className="h-5 w-5 group-hover:scale-110 transition duration-200" />
            </Button>
        </div>
    )
}