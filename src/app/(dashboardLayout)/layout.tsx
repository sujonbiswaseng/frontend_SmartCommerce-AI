

import { AppSidebar } from '@/components/app-sidebar'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import ErrorFallback from '@/components/shared/ErrorFallbace'
import ProfileCard from '@/components/shared/ProfileCard'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { getSession } from '@/services/auth.service'
import { TUser } from '@/types/user.type'
import React from 'react'

const DashboardLayout = async ({ admin, manager, children }: { admin: React.ReactNode, manager: React.ReactNode, children: React.ReactNode }) => {
  const userinfo = await getSession()
  if (!userinfo || !userinfo.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-500 font-semibold">
          Failed to load user info. Please login again.
        </div>
      </div>
    )
  }
  return (
    <div className=''>
       <div className="min-h-svh w-full bg-muted/40">
      <SidebarProvider
        className="mx-auto min-h-svh w-full max-w-screen-2xl border-x border-border/60 bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:border-border/40 dark:shadow-none"
        style={
          {
            '--sidebar-width': '16rem',
            '--sidebar-width-mobile': '18rem',
            '--dashboard-shell-max': '1536px',
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="flex min-h-svh min-w-0 flex-1 flex-col border-l border-border/70 bg-background">
          <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-md dark:bg-background/80">
            <div className="flex h-14 w-full items-center gap-3 ">
              <SidebarTrigger className="-ml-1 shrink-0" />
              <div className="flex min-w-0 flex-1 justify-center">
                <div className="relative w-full max-w-md">
                  <input
                    type="search"
                    aria-label="Dashboard search"
                    placeholder="Search dashboard…"
                    className="h-10 w-full rounded-xl border border-input bg-muted/40 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-muted/25"
                  />
                  <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8">

                <ProfileCard  profile={userinfo?.data as TUser} />
              </div>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-auto">
            <div className="flex w-full flex-1 flex-col items-stretch">
              <ErrorBoundary
                fallback={
                  <ErrorFallback
                    title="Dashboard load failed"
                    message="Something went wrong while loading the dashboard."
                  />
                }
              >
                {userinfo?.data?.role === 'ADMIN' ? admin : manager}
              </ErrorBoundary>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
    </div>
  )
}

export default DashboardLayout