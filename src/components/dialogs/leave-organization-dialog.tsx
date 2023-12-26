"use client"

import {
   AlertDialog,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { useRouter } from "@/navigation"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { api } from "@/trpc/react"
import { type Organization } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

export function LeaveOrganizationDialog({
   organization,
}: {
   organization: Pick<Organization, "name" | "id">
}) {
   const t = useTranslations("organization-settings")
   const tCommon = useTranslations("common")
   const router = useRouter()
   const [open, setOpen] = useState(false)
   const { removeExpandedOrganizations } = useOrganizationHelpersStore()

   const { isLoading, mutate: onLeave } = api.organization.leave.useMutation({
      onSuccess: ({
         leftOrganizationName,
         leftOrganizationId,
         firstOrganizationId,
      }) => {
         router.push(`/dashboard/${firstOrganizationId}`)
         router.refresh()
         toast.success(
            t.rich("leave-success-toast", { name: leftOrganizationName })
         )
         setOpen(false)
         removeExpandedOrganizations(leftOrganizationId)
      },
      onError: () => {
         toast.error(t("leave-error-toast"))
      },
   })

   return (
      <AlertDialog
         open={open}
         onOpenChange={setOpen}
      >
         <Button
            variant={"secondary"}
            className="w-fit"
            asChild
         >
            <AlertDialogTrigger>{t("leave-title")}</AlertDialogTrigger>
         </Button>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{t("leave-title")}</AlertDialogTitle>
               <AlertDialogDescription asChild>
                  <div>
                     <p
                        dangerouslySetInnerHTML={{
                           __html: t.markup("leave-warning-1", {
                              name: organization?.name,
                              strong: (chunks) =>
                                 `<strong class="font-semibold">${chunks}</strong>`,
                           }),
                        }}
                     ></p>
                     <p className="mt-2">{t("leave-warning-2")}</p>
                  </div>
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel className="mr-auto">
                  {tCommon("cancel")}
               </AlertDialogCancel>
               <Button
                  variant={"secondary"}
                  disabled={isLoading}
                  onClick={() => onLeave({ organizationId: organization.id })}
                  className="w-fit"
               >
                  {t("leave-title")}
                  {isLoading && <Loading />}
               </Button>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}
