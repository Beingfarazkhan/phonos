"use client"
import { Button } from "@workspace/ui/components/button"
import { Inbox, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from "@workspace/ui/lib/utils"
import { screenAtom } from "../../atoms/widget-atom"
import { useAtom } from "jotai"

export const WidgetFooter = () => {
    const [screen, setScreen] = useAtom(screenAtom)

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
                    screen === "selection" ? "left-[0%]" : "left-[50%]",
                    "rounded-b-xl rounded-t-none"
                )}
                style={{
                    translateX: "0%",

                }}
            />

            {/* Buttons (on top of the curved div) */}
            <Button
                size="icon"
                variant="transparent"
                onClick={() => setScreen("selection")}
                className={cn(
                    "group flex-1 h-full relative z-10 transition-colors duration-300 ",
                    screen === "selection" ? "text-secondary-foreground" : "text-primary-foreground"
                )}
            >
                <Home className="h-5 w-5 group-hover:scale-110 transition duration-200" />
            </Button>

            <Button
                size="icon"
                variant="transparent"
                onClick={() => setScreen("inbox")}
                className={cn(
                    "group flex-1 h-full relative z-10 transition-colors duration-300",
                    screen === "inbox" ? "text-secondary-foreground" : "text-primary-foreground"
                )}
            >
                <Inbox className="h-5 w-5 group-hover:scale-110 transition duration-200" />
            </Button>
        </div>
    )
}