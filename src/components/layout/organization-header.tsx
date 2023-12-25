"use client"

import { AccountMenu } from "@/components/account-menu"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useIsClient } from "@/hooks/use-is-client"
import { useOrganizationHelpers } from "@/hooks/use-organization-helpers"
import { cn } from "@/lib/utils"
import { Link } from "@/navigation"
import { useGlobalStore } from "@/stores/use-global-store"
import { Menu } from "lucide-react"
import { useShallow } from "zustand/react/shallow"

export function OrganizationHeader({
   organizationsCount,
}: {
   organizationsCount: number
}) {
   const { isClient } = useIsClient()
   const { openDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
      }))
   )

   const { lastVisitedOrganizationId } = useOrganizationHelpers()

   const isNoOrganizations = organizationsCount < 1

   return (
      <header className="flex min-h-[var(--header-height)] items-center bg-background/50 py-2 shadow-sm shadow-border backdrop-blur-md">
         <div className="container flex items-center justify-between">
            {isClient ? (
               <Link
                  className={cn(!isNoOrganizations ? "max-lg:hidden" : "")}
                  href={`/dashboard/${lastVisitedOrganizationId}`}
               >
                  <Icons.logo />
               </Link>
            ) : null}
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
