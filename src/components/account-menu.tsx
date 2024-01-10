"use client"

import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuPortal,
   DropdownMenuSeparator,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useClerk } from "@clerk/nextjs"
import { Link, useRouter, usePathname } from "@/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useGlobalStore } from "@/stores/use-global-store"
import { useShallow } from "zustand/react/shallow"
import { CreateOrganizationDialog } from "@/components/dialogs/create-organization-dialog"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { startTransition, type ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { useIsHydrated } from "@/hooks/use-is-hydrated"
import { UserSettingsDialog } from "@/components/dialogs/user-settings-dialog"
import { type User } from "@prisma/client"

export function AccountMenu({
   className,
   user,
   ...props
}: ComponentProps<"div"> & { user: User }) {
   const { lastVisitedOrganizationId } = useOrganizationHelpersStore()
   const { isHydrated } = useIsHydrated()
   const { signOut } = useClerk()
   const { setTheme, theme } = useTheme()
   const { openDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
      }))
   )

   const locale = useLocale()
   const t = useTranslations("account-menu")
   const router = useRouter()
   const pathname = usePathname()

   return (
      <>
         <CreateOrganizationDialog />
         <UserSettingsDialog />
         <DropdownMenu>
            <div
               className={cn("flex items-center gap-2", className)}
               {...props}
            >
               <p className="flex items-center gap-2 font-medium text-foreground/75">
                  <UserAvatar
                     className="[--avatar-size:29px]"
                     user={{
                        email: user.email,
                        firstName: user.firstName ?? undefined,
                        imageUrl: user.imageUrl,
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
            {/* <div className="ml-auto flex items-center gap-2 font-medium">
                  <Skeleton className="h-[var(--color-avatar-size)] w-[var(--color-avatar-size)] rounded-full" />
                  <Skeleton className="h-3 w-20 max-sm:hidden" />
                  <Skeleton className="mx-2 h-4 w-4" />
               </div> */}
            {isHydrated && (
               <DropdownMenuContent
                  align="end"
                  className="px-3 pb-2"
               >
                  <div className="px-1.5 py-1">
                     <p className="font-medium">
                        {user.firstName} {user.lastName}
                     </p>
                     <p className="truncate text-sm text-foreground/60">
                        {user.email}
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

                  <DropdownMenuSub>
                     <DropdownMenuSubTrigger>
                        {t("item3")}
                     </DropdownMenuSubTrigger>
                     <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                           <DropdownMenuCheckboxItem
                              checked={theme === "light"}
                              onCheckedChange={() => setTheme("light")}
                           >
                              {t("item3:1")}
                           </DropdownMenuCheckboxItem>
                           <DropdownMenuCheckboxItem
                              checked={theme === "dark"}
                              onCheckedChange={() => setTheme("dark")}
                           >
                              {t("item3:2")}
                           </DropdownMenuCheckboxItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuCheckboxItem
                              checked={theme === "system"}
                              onCheckedChange={() => setTheme("system")}
                           >
                              {t("item3:3")}
                           </DropdownMenuCheckboxItem>
                        </DropdownMenuSubContent>
                     </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                     <DropdownMenuSubTrigger>
                        {t("item4")}
                     </DropdownMenuSubTrigger>
                     <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                           <DropdownMenuCheckboxItem
                              onCheckedChange={() => {
                                 startTransition(() =>
                                    router.replace(pathname, { locale: "en" })
                                 )
                              }}
                              checked={locale === "en"}
                           >
                              {t("item4:1")}
                           </DropdownMenuCheckboxItem>
                           <DropdownMenuCheckboxItem
                              onCheckedChange={() => {
                                 startTransition(() =>
                                    router.replace(pathname, { locale: "uk" })
                                 )
                              }}
                              checked={locale === "uk"}
                           >
                              {t("item4:2")}
                           </DropdownMenuCheckboxItem>
                        </DropdownMenuSubContent>
                     </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuItem onClick={() => openDialog("userSettings")}>
                     {t("item5")}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                     onSelect={async () => {
                        await signOut(() => router.push("/"))
                     }}
                  >
                     {t("item6")}
                  </DropdownMenuItem>
               </DropdownMenuContent>
            )}
         </DropdownMenu>
      </>
   )
}
