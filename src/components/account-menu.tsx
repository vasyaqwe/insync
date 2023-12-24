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
import { CreateOrganizationDialog } from "@/components/dialogs/create-organization-dialog"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      <>
         <CreateOrganizationDialog />
         <DropdownMenu>
            {isLoaded && user ? (
               <div className="flex items-center gap-2">
                  <p className="flex items-center gap-2 font-medium text-foreground/75">
                     <UserAvatar
                        className="[--avatar-size:29px]"
                        user={{
                           email: user.emailAddresses[0]?.emailAddress,
                           firstName: user.firstName ?? undefined,
                           imageUrl: user.imageUrl ?? undefined,
                        }}
                     />
                     <span className="max-sm:hidden"> {user.firstName}</span>
                  </p>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant={"ghost"}
                        size={"icon"}
                     >
                        <ChevronsUpDown
                           size={18}
                           className="stroke-foreground/75"
                        />
                        <span className="sr-only">More...</span>
                     </Button>
                  </DropdownMenuTrigger>
               </div>
            ) : (
               <div className="flex items-center gap-2 font-medium">
                  <Skeleton className="h-[var(--color-avatar-size)] w-[var(--color-avatar-size)] rounded-full" />
                  <Skeleton className="h-3 w-20 max-sm:hidden" />
                  <Skeleton className="mx-2 h-4 w-4" />
               </div>
            )}
            {user && (
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
      </>
   )
}
