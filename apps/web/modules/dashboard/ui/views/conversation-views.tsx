import Image from "next/image"


export const ConversationView = () => {
  return (
    <div className="flex flex-col flex-1 h-full w-full gap-y-4 bg-muted">
      <div className="flex flex-1 items-center justify-center gap-x-2">
        <Image alt="Phonos" height={40} width={40} src={"/phonos.svg"} />
        <p className="font-semibold text-lg">Phonos</p>
      </div>
    </div>
  )
}