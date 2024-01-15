"use client"

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { type Organization } from "@prisma/client"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"

const DeleteOrganizationDialogContent = dynamic(
   () => import("@/components/dialogs/delete-organization-dialog-content"),
   {
      ssr: false,
   }
)

export function DeleteOrganizationDialog({
   organization,
}: {
   organization: Pick<Organization, "name" | "id">
}) {
   const t = useTranslations("organization-settings")

   return (
      <AlertDialog>
         <Button
            className="w-fit"
            variant={"destructive"}
            asChild
         >
            <AlertDialogTrigger>{t("delete-title")}</AlertDialogTrigger>
         </Button>
         <DeleteOrganizationDialogContent organization={organization} />
      </AlertDialog>
   )
}
