"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useIsHydrated } from "@/hooks/use-is-hydrated"
import { Link } from "@/navigation"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { useAuth } from "@clerk/nextjs"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function Header() {
   const t = useTranslations("header")
   const { isSignedIn } = useAuth()

   const { lastVisitedOrganizationId } = useOrganizationHelpersStore()
   const { isHydrated } = useIsHydrated()

   return (
      <header className="flex min-h-[var(--header-height)] items-center bg-background/50 py-2 shadow-sm shadow-border backdrop-blur-md">
         <div className="container flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Link href={"/"}>
                  <Icons.logo />
               </Link>
            </div>

            {isSignedIn ? (
               isHydrated ? (
                  <Button
                     size={"sm"}
                     className="text-center"
                     asChild
                  >
                     <Link href={`/dashboard/${lastVisitedOrganizationId}`}>
                        {t("button")}
                        <ArrowUpRight />
                     </Link>
                  </Button>
               ) : null
            ) : (
               <Button
                  size={"sm"}
                  className="text-center"
                  asChild
               >
                  <Link href={"/sign-in"}>
                     {t("button")}
                     <ArrowUpRight />
                  </Link>
               </Button>
            )}
         </div>
      </header>
   )
}
