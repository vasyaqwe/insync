"use client"

import { AccountMenu } from "@/components/account-menu"
import { Button } from "@/components/ui/button"
import { Link } from "@/navigation"
import { useGlobalStore } from "@/stores/use-global-store"
import { api } from "@/trpc/react"
import logoNoText from "@public/logo-no-text.svg"
import { ChevronsUpDown, Slash } from "lucide-react"
import Image from "next/image"
import { useShallow } from "zustand/react/shallow"
import { ColorAvatar } from "@/components/ui/color-avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { useIsHydrated } from "@/hooks/use-is-hydrated"

export function BoardHeader() {
   const { openDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
      }))
   )

   const { lastVisitedOrganizationId } = useOrganizationHelpersStore()
   const { isHydrated } = useIsHydrated()

   const {
      isLoading,
      isError,
      data: organization,
   } = api.organization.get.useQuery(
      {
         organizationId: isHydrated ? lastVisitedOrganizationId : "",
      },
      { refetchOnWindowFocus: false, enabled: isHydrated }
   )

   return (
      <header className="grid min-h-[var(--header-height)] grid-cols-full-width-split-screen items-center bg-background/50 py-2 shadow-sm shadow-border backdrop-blur-md">
         <div className="col-start-2 col-end-4 flex items-center justify-between gap-6 md:px-[var(--container-padding-inline)]">
            <div className="flex items-center gap-2">
               {isHydrated ? (
                  <Link
                     className="flex-shrink-0"
                     href={`/dashboard/${lastVisitedOrganizationId}`}
                  >
                     <Image
                        src={logoNoText}
                        alt="insync."
                     />
                  </Link>
               ) : (
                  <div className="relative flex w-[47px] items-center">
                     <Skeleton className="h-[var(--color-avatar-size)] w-[var(--color-avatar-size)] flex-shrink-0 rounded-full" />
                     <Skeleton className="absolute right-0 h-[var(--color-avatar-size)] w-[var(--color-avatar-size)] flex-shrink-0 rounded-full" />
                  </div>
               )}
               <Slash className="flex-shrink-0 rotate-[-15deg] stroke-muted" />
               {isLoading ? (
                  <div className="flex items-center gap-2 font-medium">
                     <Skeleton className="h-[var(--color-avatar-size)] w-[var(--color-avatar-size)] rounded-full" />
                     <Skeleton className="h-3 w-16 md:w-24" />
                  </div>
               ) : !isError ? (
                  <div className="flex items-center gap-2 font-medium text-foreground/75">
                     <ColorAvatar color={organization?.color ?? ""} />
                     <span className="line-clamp-1 break-all">
                        {" "}
                        {organization?.name}
                     </span>
                  </div>
               ) : null}
               {!isLoading && (
                  <Button
                     onClick={() => openDialog("mobileSidebar")}
                     className="flex-shrink-0 lg:hidden"
                     variant={"ghost"}
                     size={"icon"}
                  >
                     <ChevronsUpDown
                        size={18}
                        className="stroke-foreground/75"
                     />
                     <span className="sr-only">Switch organization</span>
                  </Button>
               )}
            </div>

            <AccountMenu />
         </div>
      </header>
   )
}
