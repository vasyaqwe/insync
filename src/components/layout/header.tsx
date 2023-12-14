"use client"

import { AccountMenu } from "@/components/account-menu"
import { Button } from "@/components/ui/button"
import { useLastVisitedOrganizationId } from "@/hooks/use-last-visited-organization-id"
import { Link, usePathname } from "@/navigation"
import { useGlobalStore } from "@/stores/use-global-store"
import { useUser } from "@clerk/nextjs"
import logo from "@public/logo.svg"
import { ArrowUpRight, Menu } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useShallow } from "zustand/react/shallow"

export function Header() {
   const t = useTranslations("header")
   const pathname = usePathname()
   const { isSignedIn } = useUser()
   const { openDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
      }))
   )

   const lastVisitedOrganizationId = useLastVisitedOrganizationId()

   return pathname.includes("invite") ? null : (
      <header className="flex h-[var(--header-height)] items-center bg-background/50 py-2 shadow-sm backdrop-blur-md">
         <div className="container flex items-center justify-between">
            <Link
               className="max-lg:hidden"
               href={
                  isSignedIn ? `/dashboard/${lastVisitedOrganizationId}` : "/"
               }
            >
               <Image
                  src={logo}
                  alt="insync."
               />
            </Link>
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
