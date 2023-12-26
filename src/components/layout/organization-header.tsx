"use client"

import { AccountMenu } from "@/components/account-menu"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsHydrated } from "@/hooks/use-is-hydrated"
import { cn } from "@/lib/utils"
import { Link } from "@/navigation"
import { useGlobalStore } from "@/stores/use-global-store"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { Menu } from "lucide-react"
import { useShallow } from "zustand/react/shallow"

export function OrganizationHeader({
   organizationsCount,
}: {
   organizationsCount: number
}) {
   const { isHydrated } = useIsHydrated()
   const { openDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
      }))
   )

   const { lastVisitedOrganizationId } = useOrganizationHelpersStore()

   const isNoOrganizations = organizationsCount < 1

   return (
      <header className="flex min-h-[var(--header-height)] items-center bg-background/50 py-2 shadow-sm shadow-border backdrop-blur-md">
         <div className="container flex items-center justify-between">
            {isHydrated ? (
               <Link
                  className={cn(!isNoOrganizations ? "max-lg:hidden" : "")}
                  href={`/dashboard/${lastVisitedOrganizationId}`}
               >
                  <Icons.logo />
               </Link>
            ) : (
               <div className="flex items-center gap-3 max-lg:hidden">
                  <div className="relative flex w-[47px] items-center">
                     <Skeleton className="h-[var(--color-avatar-size)] w-[var(--color-avatar-size)] flex-shrink-0 rounded-full" />
                     <Skeleton className="absolute right-0 h-[var(--color-avatar-size)] w-[var(--color-avatar-size)] flex-shrink-0 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-24" />
               </div>
            )}
            {!isNoOrganizations && (
               <Button
                  onClick={() => openDialog("mobileSidebar")}
                  className="lg:hidden"
                  variant={"ghost"}
                  size={"icon"}
               >
                  <Menu />
                  <span className="sr-only">Switch organization</span>
               </Button>
            )}
            <AccountMenu className="ml-auto" />
         </div>
      </header>
   )
}
