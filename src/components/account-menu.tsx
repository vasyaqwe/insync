"use client"

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useClerk, useUser } from "@clerk/nextjs"
import { Link, useRouter } from "@/navigation"
import { useTranslations } from "next-intl"
import { useGlobalStore } from "@/stores/use-global-store"
import { useShallow } from "zustand/react/shallow"
import { useOrganizationHelpers } from "@/hooks/use-organization-helpers"
import { Skeleton } from "@/components/ui/skeleton"

export function AccountMenu() {
   const { lastVisitedOrganizationId } = useOrganizationHelpers()
   const { signOut } = useClerk()
   const { openDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
      }))
   )
   const { user, isLoaded } = useUser()
   const t = useTranslations("account-menu")
   const router = useRouter()

   return (
      <DropdownMenu>
         {isLoaded && user ? (
            <DropdownMenuTrigger className="ml-auto rounded-full transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ">
               <UserAvatar
                  user={{
                     email: user.emailAddresses[0]?.emailAddress,
                     firstName: user.firstName ?? undefined,
                     imageUrl: user.imageUrl ?? undefined,
                  }}
               />
            </DropdownMenuTrigger>
         ) : (
            <Skeleton className="ml-auto h-[var(--avatar-size)] w-[var(--avatar-size)] rounded-full" />
         )}
         {user && (
            <DropdownMenuContent
               align="end"
               className="px-3 pb-2"
            >
               <div className="px-1.5 py-1">
                  <p className="font-medium">
                     {user?.firstName} {user?.lastName}
                  </p>
                  <p className="truncate text-sm text-foreground/60">
                     {user?.emailAddresses[0]?.emailAddress}
                  </p>
               </div>
               <DropdownMenuSeparator />

               <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${lastVisitedOrganizationId}`}>
                     {t("item1")}
                  </Link>
               </DropdownMenuItem>

               <DropdownMenuItem
                  onClick={() => openDialog("createOrganization")}
               >
                  {t("item2")}
               </DropdownMenuItem>

               <DropdownMenuItem asChild>
                  <Link href={"/settings"}>{t("item3")}</Link>
               </DropdownMenuItem>

               <DropdownMenuSeparator />

               <DropdownMenuItem
                  onSelect={async () => {
                     await signOut(() => router.push("/"))
                  }}
               >
                  {t("item4")}
               </DropdownMenuItem>
            </DropdownMenuContent>
         )}
      </DropdownMenu>
   )
}
