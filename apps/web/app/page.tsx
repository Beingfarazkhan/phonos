"use client"
import { api } from "@workspace/backend/_generated/api"
import { useQuery } from "convex/react"

export default function Page() {
  const users = useQuery(api.users.getMany)
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <p>App/Web</p>
        {users?.map((user, idx) => (
          <p key={idx}>{idx} : {user.name}</p>
        ))}
      </div>
    </div>
  )
}
