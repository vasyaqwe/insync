"use client"

import { AccountMenu } from "@/components/account-menu"
import { Button } from "@/components/ui/button"
import { Link, usePathname } from "@/navigation"
import { type User } from "@clerk/nextjs/server"
import logo from "@public/logo.svg"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

export function Header({ user }: { user: User | null | undefined }) {
   const t = useTranslations("header")
   const pathname = usePathname()

   return (
      <header className="flex h-[var(--header-height)] items-center bg-background/50 py-2 shadow-sm backdrop-blur-md">
         <div className="container flex items-center justify-between">
            <Link href={"/"}>
               <Image
                  src={logo}
                  alt="insync."
               />
            </Link>

            {user && pathname !== "/" ? (
               <AccountMenu user={user} />
            ) : (
               <Button
                  size={"sm"}
                  className="text-center"
                  asChild
               >
                  <Link href={user ? "/dashboard" : "/sign-up"}>
                     {t("button")}
                     <ArrowUpRight />
                  </Link>
               </Button>
            )}
         </div>
      </header>
   )
}
