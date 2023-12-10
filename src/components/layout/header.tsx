"use client"

import { AccountMenu } from "@/components/account-menu"
import { Button } from "@/components/ui/button"
import { Link, usePathname } from "@/navigation"
import { useUser } from "@clerk/nextjs"
import logo from "@public/logo.svg"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

export function Header() {
   const t = useTranslations("header")
   const pathname = usePathname()
   const { isSignedIn } = useUser()

   const lastVisitedOrganizationId = JSON.parse(
      localStorage.getItem("last-visited-organization-id") ?? ""
   )

   return pathname.includes("invite") ? null : (
      <header className="flex h-[var(--header-height)] items-center bg-background/50 py-2 shadow-sm backdrop-blur-md">
         <div className="container flex items-center justify-between">
            <Link
               href={
                  isSignedIn ? `/dashboard/${lastVisitedOrganizationId}` : "/"
               }
            >
               <Image
                  src={logo}
                  alt="insync."
               />
            </Link>

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
