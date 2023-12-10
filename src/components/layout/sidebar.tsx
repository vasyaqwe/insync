"use client"

import { Hint } from "@/components/hint"
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
import { Link, usePathname, useRouter } from "@/navigation"
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
import { useEffect } from "react"
import { useShallow } from "zustand/react/shallow"

export function Sidebar({ organizations }: { organizations: Organization[] }) {
   const t = useTranslations("sidebar")

   const [lastVisitedOrganizationId, setLastVisitedOrganizationId] =
      useLocalStorage("last-visited-organization-id", organizations[0]?.id)

   const { openDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
      }))
   )

   const pathname = usePathname()
   const router = useRouter()

   useEffect(() => {
      if (pathname === "/dashboard" && lastVisitedOrganizationId) {
         router.push(`/dashboard/${lastVisitedOrganizationId}`)
      }
   }, [pathname, lastVisitedOrganizationId, router])

   const currentOrganizationId = pathname.split("/dashboard/")?.[1] ?? ""

   return organizations.length < 1 ? (
      <Card className="mx-auto py-6 text-center text-lg">
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
      <Card
         asChild
         className="max-w-xs"
      >
         <aside>
            <div className="flex items-center justify-between border-b-2 border-dotted pb-3">
               <p className="text-lg font-medium">{t("title")}</p>
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
                              "rounded-lg p-3 hover:bg-primary/10 hover:no-underline"
                           }
                        >
                           <div className="flex items-center gap-2">
                              <ColorAvatar color={org.color} />
                              {org.name}
                           </div>
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
                                 onClick={() =>
                                    setLastVisitedOrganizationId(org.id)
                                 }
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
                                 onClick={() =>
                                    setLastVisitedOrganizationId(org.id)
                                 }
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
                                 onClick={() =>
                                    setLastVisitedOrganizationId(org.id)
                                 }
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
                                 onClick={() =>
                                    setLastVisitedOrganizationId(org.id)
                                 }
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
      </Card>
   )
}
