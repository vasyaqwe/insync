"use client"

import { CreateOrganizationDialog } from "@/components/dialogs/create-organization-dialog"
import { Card } from "@/components/ui/card"
import { useTranslations } from "next-intl"

export function Sidebar() {
   const t = useTranslations("sidebar")

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
         </aside>
      </Card>
   )
}
