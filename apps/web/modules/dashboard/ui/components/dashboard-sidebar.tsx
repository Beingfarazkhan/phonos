"use client"

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { Separator } from "@workspace/ui/components/separator"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger } from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"
import { CreditCardIcon, InboxIcon, LayoutDashboardIcon, LibraryBigIcon, Mic, PaletteIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"


const customerSupportItems = [
    {
        title: 'Conversations',
        url: '/conversations',
        icon: InboxIcon
    },
    {
        title: 'Knowledge Base',
        url: '/files',
        icon: LibraryBigIcon
    }
]

const configurationItems = [
    {
        title: 'Widget Customization',
        url: '/customization',
        icon: PaletteIcon
    },
    {
        title: 'Integrations',
        url: '/integrations',
        icon: LayoutDashboardIcon
    },
    {
        title: 'Voice Assistant',
        url: '/plugins/vapi',
        icon: Mic
    },
]

const accountItems = [
    {
        title: 'Plans & Billing',
        url: '/billing',
        icon: CreditCardIcon
    },
]

export const DashboardSidebar = () => {

    const pathname = usePathname()

    const isActive = (url: string) => {
        if (url === "/") {
            return pathname === "/"
        }

        return pathname.startsWith(url)
    }

    return (
        <Sidebar className="group" collapsible="icon">
            {/* Sidebar Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size={'lg'}>
                            <OrganizationSwitcher
                                hidePersonal
                                skipInvitationScreen
                                appearance={
                                    {
                                        elements: {
                                            rootBox: "w-full! h-8!",
                                            avatarBox: "size-4! rounded-sm! group-data-[collapsible=icon]:size-5!",
                                            organizationSwitcherTrigger: "w-full! justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                                            organizationPreview: "group-data-[collapsible=icon]:justify-center! gap-2!",
                                            organizationPreviewTextContainer: "group-data-[collapsible=icon]:hidden! text-sm! font-medium! text-sidebar-foreground!",
                                            organizationSwitcherTriggerIcon: "group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground"
                                        }
                                    }
                                }
                            />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            {/* <SidebarTrigger>Trigger</SidebarTrigger> */}
            <Separator className="mt-1" />

            <SidebarContent>
                {/* Customer Support */}
                <SidebarGroup>
                    <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {customerSupportItems.map((item, idx) => (
                                <SidebarMenuItem key={idx}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        className={cn(isActive(item.url) && "bg-gradient-to-br from-secondary-foreground to-primary! text-primary-foreground! hover:to-foreground/90!")}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator />

                {/* Configuration */}
                <SidebarGroup>
                    <SidebarGroupLabel>Configuration</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {configurationItems.map((item, idx) => (
                                <SidebarMenuItem key={idx}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        className={cn(isActive(item.url) && "bg-gradient-to-br from-secondary-foreground to-primary! text-primary-foreground! hover:to-foreground/90!")}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator />
                {/* Account */}
                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountItems.map((item, idx) => (
                                <SidebarMenuItem key={idx}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        className={cn(isActive(item.url) && "bg-gradient-to-br from-secondary-foreground to-primary! text-primary-foreground! hover:to-foreground/90!")}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <UserButton showName appearance={{
                            elements: {
                                rootBox: "w-full! h-8!",
                                userButtonTrigger: "w-full! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                                userButtonBox: "w-full! flex-row-reverse! gap-2! justify-end! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!",
                                userButtonOuterIdentifier: "pl-0! group-data-[collapsible=icon]:hidden!",
                                avatarBox: "size-5!"
                            }
                        }} />
                    </SidebarMenuItem>

                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}