"use client"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { api } from "@workspace/backend/_generated/api"
import { Authenticated, Unauthenticated, useQuery } from "convex/react"


export default function Page() {
  const users = useQuery(api.users.getMany)
  return (
    <>
      <Authenticated>
        <div className="flex items-center justify-center min-h-svh">
          <div className="flex flex-col items-center justify-center gap-4">
            <UserButton />
            <p>App/Web</p>
            {users?.map((user, idx) => (
              <p key={idx}>{idx} : {user.name}</p>
            ))}
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <div>
          <SignInButton>Sign In</SignInButton>
        </div>
      </Unauthenticated>
    </>
  )
}
