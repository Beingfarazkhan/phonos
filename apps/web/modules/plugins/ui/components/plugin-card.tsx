import { Button } from "@workspace/ui/components/button"
import { ArrowLeftRightIcon, LucideIcon, PlugIcon } from "lucide-react"
import Image from "next/image"


export type Feature = {
  icon: LucideIcon,
  label: string,
  description: string
}

export type PluginCardProps = {
  isDisabled?: boolean,
  serviceName: string,
  serviceImage: string,
  features: Feature[],
  onSubmit: () => void
}

export const PluginCard = ({
  isDisabled,
  serviceImage,
  serviceName,
  features,
  onSubmit
}: PluginCardProps) => {
  return (
    <div className="h-full w-full rounded-lg border bg-background p-8">
      <div className="mb-6 flex items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <Image
            alt={serviceName}
            src={serviceImage}
            width={40}
            height={40}
            className="rounded object-contain bg-black"
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <ArrowLeftRightIcon />
        </div>
        <div className="flex flex-col items-center">
          <Image
            alt="Platform"
            src='/phonos.svg'
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      </div>

      <div className="mb-6 text-center">
        <p className="text-lg">
          Connect your {serviceName} account
        </p>
      </div>

      <div className="mb-6">
        <div className="space-y-6">
          {features.map((feature) => (
            <div className="flex items-center gap-3" key={feature.label}>
              <div className="flex size-8 items-center justify-center rounded-lg border bg-muted">
                <feature.icon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium text-sm">{feature.label}</div>
                <div className="text-muted-foreground text-xs">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button
          className="size-full"
          disabled={isDisabled}
          onClick={onSubmit}
          variant={"default"}
        >
          Connect
          <PlugIcon />
        </Button>
      </div>

    </div>
  )
}