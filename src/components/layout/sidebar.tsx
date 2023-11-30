"use client"

import { CreateOrganizationDialog } from "@/components/dialogs/create-organization-dialog"
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ColorAvatar } from "@/components/ui/color-avatar"
import { cn } from "@/lib/utils"
import { Link, usePathname } from "@/navigation"
import { type Organization } from "@prisma/client"
import {
   ActivityIcon,
   CreditCardIcon,
   LayoutIcon,
   SettingsIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

export function Sidebar({ organizations }: { organizations: Organization[] }) {
   const t = useTranslations("sidebar")
   const pathname = usePathname()

   return (
      <Card
         asChild
         className="max-w-xs"
      >
         <aside>
            <div className="flex items-center justify-between">
               <p className="text-lg font-medium">{t("title")}</p>
               <CreateOrganizationDialog />
            </div>
            {organizations.length > 0 && (
               <Accordion
                  type="single"
                  className="mt-3"
               >
                  {organizations.map((org) => {
                     return (
                        <AccordionItem
                           className="border-b-0"
                           key={org.id}
                           value={org.id}
                        >
                           <AccordionTrigger className="rounded-lg p-3 hover:bg-accent hover:no-underline">
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
                                 <Link href={`/dashboard/${org.id}`}>
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
                                 <Link href={`/dashboard/${org.id}/activity`}>
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
                                 <Link href={`/dashboard/${org.id}/settings`}>
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
                                 <Link href={`/dashboard/${org.id}/billing`}>
                                    <CreditCardIcon /> {t("item4")}
                                 </Link>
                              </Button>
                           </AccordionContent>
                        </AccordionItem>
                     )
                  })}
               </Accordion>
            )}
         </aside>
      </Card>
   )
}
