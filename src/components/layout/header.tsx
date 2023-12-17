"use client"

import { Button } from "@/components/ui/button"
import { useOrganizationHelpers } from "@/hooks/use-organization-helpers"
import { Link } from "@/navigation"
import { useUser } from "@clerk/nextjs"
import logo from "@public/logo.svg"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

export function Header() {
   const t = useTranslations("header")
   const { isSignedIn } = useUser()

   const { lastVisitedOrganizationId } = useOrganizationHelpers()

   return (
      <header className="flex h-[var(--header-height)] items-center bg-background/50 py-2 shadow-sm backdrop-blur-md">
         <div className="container flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Link href={"/"}>
                  <Image
                     src={logo}
                     alt="insync."
                  />
               </Link>
            </div>

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
         </div>
      </header>
   )
}
