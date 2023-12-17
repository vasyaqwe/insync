"use client"

import { AccountMenu } from "@/components/account-menu"
import { Button } from "@/components/ui/button"
import { useIsClient } from "@/hooks/use-is-client"
import { useOrganizationHelpers } from "@/hooks/use-organization-helpers"
import { Link } from "@/navigation"
import { useGlobalStore } from "@/stores/use-global-store"
import logo from "@public/logo.svg"
import { Menu } from "lucide-react"
import Image from "next/image"
import { useShallow } from "zustand/react/shallow"

export function OrganizationHeader() {
   const { isClient } = useIsClient()
   const { openDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
      }))
   )

   const { lastVisitedOrganizationId } = useOrganizationHelpers()

   return (
      <header className="flex h-[var(--header-height)] items-center bg-background/50 py-2 shadow-sm backdrop-blur-md">
         <div className="container flex items-center justify-between">
            {isClient ? (
               <Link
                  className="max-lg:hidden"
                  href={`/dashboard/${lastVisitedOrganizationId}`}
               >
                  <Image
                     src={logo}
                     alt="insync."
                  />
               </Link>
            ) : null}
            <Button
               onClick={() => openDialog("mobileSidebar")}
               className="lg:hidden"
               variant={"ghost"}
               size={"icon"}
            >
               <Menu />
               <span className="sr-only">Switch organization</span>
            </Button>

            <AccountMenu />
         </div>
      </header>
   )
}
