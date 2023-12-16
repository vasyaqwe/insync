"use client"

import { AccountMenu } from "@/components/account-menu"
import { Button } from "@/components/ui/button"
import { useOrganizationHelpers } from "@/hooks/use-organization-helpers"
import { Link, usePathname } from "@/navigation"
import { useGlobalStore } from "@/stores/use-global-store"
import { api } from "@/trpc/react"
import { useUser } from "@clerk/nextjs"
import logo from "@public/logo.svg"
import logoNoText from "@public/logo-no-text.svg"
import { ArrowUpRight, Menu, Slash } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useShallow } from "zustand/react/shallow"
import { ColorAvatar } from "@/components/ui/color-avatar"
import { Skeleton } from "@/components/ui/skeleton"

export function Header() {
   const t = useTranslations("header")
   const pathname = usePathname()
   const { isSignedIn } = useUser()
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
   } = api.organization.get.useQuery({
      organizationId: lastVisitedOrganizationId,
   })

   const isOnBoardPage = pathname.includes("/board/")

   return pathname.includes("invite") ? null : (
      <header className="flex h-[var(--header-height)] items-center bg-background/50 py-2 shadow-sm backdrop-blur-md">
         <div className="container flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Link
                  className="max-lg:hidden"
                  href={
                     isSignedIn
                        ? `/dashboard/${lastVisitedOrganizationId}`
                        : "/"
                  }
               >
                  <Image
                     src={isOnBoardPage ? logoNoText : logo}
                     alt="insync."
                  />
               </Link>
               {isOnBoardPage && (
                  <>
                     <Slash className="rotate-[-15deg] stroke-muted" />
                     {isLoading ? (
                        <div className="flex items-center gap-2 font-medium">
                           <Skeleton className="h-[var(--color-avatar-size)] w-[var(--color-avatar-size)] rounded-full" />
                           <Skeleton className="h-3 w-24" />
                        </div>
                     ) : !isError ? (
                        <div className="flex items-center gap-2 font-medium">
                           <ColorAvatar color={organization?.color ?? ""} />
                           {organization?.name}
                        </div>
                     ) : null}
                  </>
               )}
            </div>
            <Button
               onClick={() => openDialog("mobileSidebar")}
               className="lg:hidden"
               variant={"ghost"}
               size={"icon"}
            >
               <Menu />
               <span className="sr-only">Open menu</span>
            </Button>

            {isSignedIn && pathname !== "/" ? (
               <AccountMenu />
            ) : (
               <Button
                  size={"sm"}
                  className="text-center"
                  asChild
               >
                  <Link
                     href={
                        isSignedIn
                           ? `/dashboard/${lastVisitedOrganizationId}`
                           : "/sign-in"
                     }
                  >
                     {t("button")}
                     <ArrowUpRight />
                  </Link>
               </Button>
            )}
         </div>
      </header>
   )
}
