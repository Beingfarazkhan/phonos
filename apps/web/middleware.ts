import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'


const publicRouteMatcher = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/test"
])

const OrgFreeRouteMatcher = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/select-org(.*)"
])

export default clerkMiddleware(async (auth, req)=>{
  const {userId, orgId} = await auth()
  if(!publicRouteMatcher(req)){
    await auth.protect()
  }

  if(userId && !orgId && !OrgFreeRouteMatcher(req)){
    const searchParams = new URLSearchParams({redirectUrl: req.url})

    const selectOrgUrl = new URL(
      `/select-org?${searchParams.toString()}`,
      req.url
    )

    return NextResponse.redirect(selectOrgUrl)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}