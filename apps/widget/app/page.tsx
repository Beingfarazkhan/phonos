"use client"

import { WidgetDemoView } from "@/modules/widget/ui/views/widget-demo-view"
import { WidgetView } from "@/modules/widget/ui/views/widget-view"
import { use } from "react"

type WidgetProps = {
  searchParams: Promise<{ organizationId: string }>
}

export default function Page({ searchParams }: WidgetProps) {
  const { organizationId } = use(searchParams)

  return (
    // <WidgetView organizationId={organizationId} />
    <WidgetDemoView organizationId={organizationId} />
  )
}
