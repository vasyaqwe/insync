"use client"

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type User } from "@clerk/nextjs/server"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useClerk } from "@clerk/nextjs"
import { Link, useRouter } from "@/navigation"
import { useTranslations } from "next-intl"

type AccountMenuProps = {
   user: User
}

export function AccountMenu({ user }: AccountMenuProps) {
   const { signOut } = useClerk()
   const t = useTranslations("account-menu")
   const router = useRouter()

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="rounded-full transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ">
            <UserAvatar user={user} />
         </DropdownMenuTrigger>
         <DropdownMenuContent
            align="end"
            className="px-3 pb-2"
         >
            <div className="px-1.5 py-1">
               <p className="font-medium">
                  {user.firstName} {user.lastName}
               </p>
               <p className="truncate text-sm text-foreground/60">
                  {user.emailAddresses[0]?.emailAddress}
               </p>
            </div>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
               <Link href={"/dashboard"}>{t("item1")}</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
               <Link href={"/settings"}>{t("item2")}</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
               onSelect={async () => {
                  await signOut(() => router.push("/"))
               }}
            >
               {t("item3")}
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
