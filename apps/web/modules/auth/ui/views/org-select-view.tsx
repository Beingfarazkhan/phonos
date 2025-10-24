"use client"

import { OrganizationList } from "@clerk/nextjs"

export const OrgSelectView = () => {
    return (
        <OrganizationList
            afterSelectOrganizationUrl={"/"}
            afterSelectPersonalUrl={"/"}
            hidePersonal
            skipInvitationScreen
        />
    )
}