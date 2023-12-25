"use client"

import { AccountMenu } from "@/components/account-menu"
import { Button } from "@/components/ui/button"
import { useOrganizationHelpers } from "@/hooks/use-organization-helpers"
import { Link } from "@/navigation"
import { useGlobalStore } from "@/stores/use-global-store"
import { api } from "@/trpc/react"
import logoNoText from "@public/logo-no-text.svg"
import { ChevronsUpDown, Slash } from "lucide-react"
import Image from "next/image"
import { useShallow } from "zustand/react/shallow"
import { ColorAvatar } from "@/components/ui/color-avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsClient } from "@/hooks/use-is-client"

export function BoardHeader() {
   const { isClient } = useIsClient()
   const { openDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
      }))
   )

   const { lastVisitedOrganizationId } = useOrganizationHelpers()

   const {
      isLoading,
      isError,
      data: organization,
   } = api.organization.get.useQuery(
      {
         organizationId: lastVisitedOrganizationId,
      },
      { refetchOnWindowFocus: false }
   )

   return (
      <header className="grid min-h-[var(--header-height)] grid-cols-full-width-split-screen items-center bg-background/50 py-2 shadow-sm shadow-border backdrop-blur-md">
         <div className="col-start-2 col-end-4 flex items-center justify-between px-[var(--container-padding-inline)]">
            {isClient ? (
               <div className="flex items-center gap-2">
                  <Link href={`/dashboard/${lastVisitedOrganizationId}`}>
                     <Image
                        src={logoNoText}
                        alt="insync."
                     />
                  </Link>
                  <Slash className="rotate-[-15deg] stroke-muted" />
                  {isLoading ? (
                     <div className="flex items-center gap-2 font-medium">
                        <Skeleton className="h-[var(--color-avatar-size)] w-[var(--color-avatar-size)] rounded-full" />
                        <Skeleton className="h-3 w-24" />
                     </div>
                  ) : !isError ? (
                     <div className="flex items-center gap-2 font-medium text-foreground/75">
                        <ColorAvatar color={organization?.color ?? ""} />
                        {organization?.name}
                     </div>
                  ) : null}
                  <Button
                     onClick={() => openDialog("mobileSidebar")}
                     className="lg:hidden"
                     variant={"ghost"}
                     size={"icon"}
                  >
                     <ChevronsUpDown
                        size={18}
                        className="stroke-foreground/75"
                     />
                     <span className="sr-only">Switch organization</span>
                  </Button>
               </div>
            ) : (
               <Image
                  src={logoNoText}
                  alt="insync."
               />
            )}

            <AccountMenu />
         </div>
      </header>
   )
}
