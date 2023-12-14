"use client"

import { Hint } from "@/components/hint"
import logo from "@public/logo.svg"
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ColorAvatar } from "@/components/ui/color-avatar"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { cn } from "@/lib/utils"
import { Link, usePathname } from "@/navigation"
import { useGlobalStore } from "@/stores/use-global-store"
import { type Organization } from "@prisma/client"
import {
   ActivityIcon,
   CreditCardIcon,
   LayoutIcon,
   PlusIcon,
   SettingsIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useShallow } from "zustand/react/shallow"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { type ComponentProps } from "react"
import Image from "next/image"

export function Sidebar({ organizations }: { organizations: Organization[] }) {
   const t = useTranslations("sidebar")

   const { openDialog, dialogs, closeDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
         closeDialog: state.closeDialog,
         dialogs: state.dialogs,
      }))
   )

   return organizations.length < 1 ? (
      <Card className="mx-auto pb-6 text-center text-lg">
         <p>{t("empty")}</p>
         <Button
            size={"lg"}
            onClick={() => openDialog("createOrganization")}
            className="mt-6"
         >
            {t("empty-button")}
         </Button>
      </Card>
   ) : (
      <>
         <Card asChild>
            <Aside
               organizations={organizations}
               className="max-w-xs max-lg:hidden"
            />
         </Card>
         <div className="lg:hidden">
            <Sheet
               open={dialogs.mobileSidebar}
               onOpenChange={(open) => {
                  if (open) {
                     openDialog("mobileSidebar")
                  } else {
                     closeDialog("mobileSidebar")
                  }
               }}
            >
               <SheetContent side={"left"}>
                  <Aside organizations={organizations} />
               </SheetContent>
            </Sheet>
         </div>
      </>
   )
}

function Aside({
   organizations,
   ...props
}: { organizations: Organization[] } & ComponentProps<"aside">) {
   const t = useTranslations("sidebar")
   const { openDialog, closeDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
         closeDialog: state.closeDialog,
      }))
   )

   const [lastVisitedOrganizationId, setLastVisitedOrganizationId] =
      useLocalStorage(
         "last-visited-organization-id",
         organizations[0]?.id ?? ""
      )

   const pathname = usePathname()

   const currentOrganizationId =
      pathname.split("/")?.[2] ?? lastVisitedOrganizationId

   return (
      <aside {...props}>
         <Link
            onClick={() => closeDialog("mobileSidebar")}
            className="lg:hidden"
            href={`/dashboard/${lastVisitedOrganizationId}`}
         >
            <Image
               className="mb-5 max-w-[130px]"
               src={logo}
               alt="insync."
            />
         </Link>
         <div className="flex items-center justify-between border-b-2 border-dotted py-2 pb-2 lg:pb-[1.05rem]">
            <p className="text-xl font-medium">{t("title")}</p>
            <Hint content={t("empty-button")}>
               <Button
                  onClick={() => openDialog("createOrganization")}
                  aria-label={t("empty-button")}
                  size={"icon"}
                  variant={"ghost"}
               >
                  <PlusIcon />
               </Button>
            </Hint>
         </div>
         <Accordion
            defaultValue={[currentOrganizationId]}
            type="multiple"
            className="mt-3"
         >
            {organizations.map((org) => {
               return (
                  <AccordionItem
                     className="border-b-0"
                     key={org.id}
                     value={org.id}
                  >
                     <AccordionTrigger
                        className={
                           "flex items-center justify-start gap-2 rounded-lg p-3 hover:bg-primary/10 hover:no-underline [&>svg]:ml-auto"
                        }
                     >
                        <ColorAvatar color={org.color} />
                        {org.name}
                     </AccordionTrigger>
                     <AccordionContent className="mt-1 space-y-1">
                        <Button
                           asChild
                           variant={"ghost"}
                           className={cn(
                              "w-full justify-start hover:bg-primary/10 hover:text-primary",
                              pathname === `/dashboard/${org.id}`
                                 ? "bg-primary/10 text-primary "
                                 : ""
                           )}
                        >
                           <Link
                              onClick={() => {
                                 setLastVisitedOrganizationId(org.id)
                                 closeDialog("mobileSidebar")
                              }}
                              href={`/dashboard/${org.id}`}
                           >
                              <LayoutIcon /> {t("item1")}
                           </Link>
                        </Button>
                        <Button
                           asChild
                           variant={"ghost"}
                           className={cn(
                              "w-full justify-start hover:bg-primary/10 hover:text-primary",
                              pathname === `/dashboard/${org.id}/activity`
                                 ? "bg-primary/10 text-primary "
                                 : ""
                           )}
                        >
                           <Link
                              onClick={() => {
                                 setLastVisitedOrganizationId(org.id)
                                 closeDialog("mobileSidebar")
                              }}
                              href={`/dashboard/${org.id}/activity`}
                           >
                              <ActivityIcon /> {t("item2")}
                           </Link>
                        </Button>
                        <Button
                           asChild
                           variant={"ghost"}
                           className={cn(
                              "w-full justify-start hover:bg-primary/10 hover:text-primary",
                              pathname === `/dashboard/${org.id}/settings`
                                 ? "bg-primary/10 text-primary "
                                 : ""
                           )}
                        >
                           <Link
                              onClick={() => {
                                 setLastVisitedOrganizationId(org.id)
                                 closeDialog("mobileSidebar")
                              }}
                              href={`/dashboard/${org.id}/settings`}
                           >
                              <SettingsIcon /> {t("item3")}
                           </Link>
                        </Button>
                        <Button
                           asChild
                           variant={"ghost"}
                           className={cn(
                              "w-full justify-start hover:bg-primary/10 hover:text-primary",
                              pathname === `/dashboard/${org.id}/billing`
                                 ? "bg-primary/10 text-primary "
                                 : ""
                           )}
                        >
                           <Link
                              onClick={() => {
                                 setLastVisitedOrganizationId(org.id)
                                 closeDialog("mobileSidebar")
                              }}
                              href={`/dashboard/${org.id}/billing`}
                           >
                              <CreditCardIcon /> {t("item4")}
                           </Link>
                        </Button>
                     </AccordionContent>
                  </AccordionItem>
               )
            })}
         </Accordion>
      </aside>
   )
}
