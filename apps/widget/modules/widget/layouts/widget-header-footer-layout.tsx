import { ReactNode } from "react";
import { WidgetFooter } from "../ui/components/widget-footer";
import { WidgetHeader } from "../ui/components/widget-header";
import { Hand } from "lucide-react";

export const WidgetHeaderFooterLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
            <WidgetFooter />
        </>
    )
}