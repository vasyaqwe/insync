"use client"

import { Hint } from "@/components/hint"
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, type CardProps } from "@/components/ui/card"
import { ColorAvatar } from "@/components/ui/color-avatar"
import { cn } from "@/lib/utils"
import { Link, usePathname } from "@/navigation"
import { useGlobalStore } from "@/stores/use-global-store"
import { type Organization } from "@prisma/client"
import {
   CreditCardIcon,
   GanttChart,
   LayoutIcon,
   PlusIcon,
   SettingsIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useShallow } from "zustand/react/shallow"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useEffect, type ComponentProps } from "react"
import { Icons } from "@/components/ui/icons"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { useIsHydrated } from "@/hooks/use-is-hydrated"

export function Sidebar({
   organizations,
   className,
}: { organizations: Organization[] } & CardProps) {
   const { openDialog, dialogs, closeDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
         closeDialog: state.closeDialog,
         dialogs: state.dialogs,
      }))
   )

   return (
      <>
         <Card asChild>
            <Aside
               organizations={organizations}
               className={cn("max-w-xs self-start max-lg:hidden", className)}
            />
         </Card>
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
            <SheetContent
               side={"left"}
               className="lg:hidden"
            >
               <Aside organizations={organizations} />
            </SheetContent>
         </Sheet>
      </>
   )
}

function Aside({
   organizations,
   ...props
}: { organizations: Organization[] } & ComponentProps<"aside">) {
   const t = useTranslations("sidebar")
   const { isHydrated } = useIsHydrated()

   const { openDialog, closeDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
         closeDialog: state.closeDialog,
      }))
   )

   const {
      lastVisitedOrganizationId,
      expandedOrganizations,
      setExpandedOrganizations,
      setLastVisitedOrganizationId,
   } = useOrganizationHelpersStore()

   useEffect(() => {
      if (
         !organizations.some((org) => org.id === lastVisitedOrganizationId) ||
         !lastVisitedOrganizationId ||
         lastVisitedOrganizationId === ""
      ) {
         setLastVisitedOrganizationId(organizations?.[0]?.id ?? "")
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [organizations, lastVisitedOrganizationId])

   const pathname = usePathname()

   function onLinkClick(orgId: string) {
      setLastVisitedOrganizationId(orgId)

      closeDialog("mobileSidebar")
   }

   const defaultAccordionValue = Object.keys(expandedOrganizations).reduce(
      (acc: string[], curr) => {
         if (expandedOrganizations[curr]) {
            acc.push(curr)
         }

         return acc
      },
      []
   )

   return (
      <aside {...props}>
         {isHydrated ? (
            <Link
               onClick={() => closeDialog("mobileSidebar")}
               className="lg:hidden"
               href={`/dashboard/${lastVisitedOrganizationId}`}
            >
               <Icons.logo
                  width={130}
                  height={35}
               />
            </Link>
         ) : null}
         <div className="flex items-center justify-between border-b-2 border-dotted py-2 pb-2 max-lg:mt-5 lg:pb-[1.05rem]">
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

         {isHydrated ? (
            <Accordion
               defaultValue={defaultAccordionValue}
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
                           onClick={() => setExpandedOrganizations(org.id)}
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
                              aria-current={
                                 pathname === `/dashboard/${org.id}` ||
                                 (org.id === lastVisitedOrganizationId &&
                                    pathname.includes("/board/"))
                                    ? "page"
                                    : undefined
                              }
                              className={cn(
                                 "w-full justify-start hover:bg-primary/10 hover:text-primary aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
                              )}
                           >
                              <Link
                                 onClick={() => onLinkClick(org.id)}
                                 href={`/dashboard/${org.id}`}
                              >
                                 <LayoutIcon /> {t("item1")}
                              </Link>
                           </Button>
                           <Button
                              asChild
                              aria-current={
                                 pathname === `/dashboard/${org.id}/activity`
                                    ? "page"
                                    : undefined
                              }
                              variant={"ghost"}
                              className={cn(
                                 "w-full justify-start hover:bg-primary/10 hover:text-primary aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
                              )}
                           >
                              <Link
                                 onClick={() => onLinkClick(org.id)}
                                 href={`/dashboard/${org.id}/activity`}
                              >
                                 <GanttChart /> {t("item2")}
                              </Link>
                           </Button>
                           <Button
                              asChild
                              aria-current={
                                 pathname === `/dashboard/${org.id}/settings`
                                    ? "page"
                                    : undefined
                              }
                              variant={"ghost"}
                              className={cn(
                                 "w-full justify-start hover:bg-primary/10 hover:text-primary aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
                              )}
                           >
                              <Link
                                 onClick={() => onLinkClick(org.id)}
                                 href={`/dashboard/${org.id}/settings`}
                              >
                                 <SettingsIcon /> {t("item3")}
                              </Link>
                           </Button>
                           <Button
                              asChild
                              aria-current={
                                 pathname === `/dashboard/${org.id}/billing`
                                    ? "page"
                                    : undefined
                              }
                              variant={"ghost"}
                              className={cn(
                                 "w-full justify-start hover:bg-primary/10 hover:text-primary aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
                              )}
                           >
                              <Link
                                 onClick={() => onLinkClick(org.id)}
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
         ) : (
            ""
         )}
      </aside>
   )
}
