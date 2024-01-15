"use client"

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { type Organization } from "@prisma/client"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"

const LeaveOrganizationDialogContent = dynamic(
   () => import("@/components/dialogs/leave-organization-dialog-content"),
   {
      ssr: false,
   }
)

export function LeaveOrganizationDialog({
   organization,
}: {
   organization: Pick<Organization, "name" | "id">
}) {
   const t = useTranslations("organization-settings")

   return (
      <AlertDialog>
         <Button
            variant={"secondary"}
            className="w-fit"
            asChild
         >
            <AlertDialogTrigger>{t("leave-title")}</AlertDialogTrigger>
         </Button>
         <LeaveOrganizationDialogContent organization={organization} />
      </AlertDialog>
   )
}
