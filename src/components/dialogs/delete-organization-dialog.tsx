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
import { MOBILE_BREAKPOINT } from "@/config"
import { useRouter } from "@/navigation"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { api } from "@/trpc/react"
import { type Organization } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

export function DeleteOrganizationDialog({
   organization,
}: {
   organization: Pick<Organization, "name" | "id">
}) {
   const t = useTranslations("organization-settings")
   const tCommon = useTranslations("common")
   const router = useRouter()
   const { removeExpandedOrganizations } = useOrganizationHelpersStore()

   const [open, setOpen] = useState(false)
   const { isLoading, mutate: onDelete } = api.organization.delete.useMutation({
      onSuccess: ({ firstOrganizationId, deletedOrganizationId }) => {
         router.push(`/dashboard/${firstOrganizationId}`)
         router.refresh()
         toast.success(t("delete-success-toast"))
         setOpen(false)
         removeExpandedOrganizations(deletedOrganizationId)
      },
      onError: () => {
         toast.error(t("delete-error-toast"))
      },
   })

   const innerWidth = typeof window === "undefined" ? 0 : window.innerWidth

   return (
      <AlertDialog
         open={open}
         onOpenChange={setOpen}
      >
         <Button
            className="w-fit"
            variant={"destructive"}
            asChild
         >
            <AlertDialogTrigger>{t("delete-title")}</AlertDialogTrigger>
         </Button>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{t("delete-title")}</AlertDialogTitle>
               <AlertDialogDescription asChild>
                  <div>
                     <p
                        dangerouslySetInnerHTML={{
                           __html: t.markup("delete-warning-1", {
                              name: organization?.name,
                              strong: (chunks) =>
                                 `<strong class="font-semibold">${chunks}</strong>`,
                           }),
                        }}
                     ></p>
                     <p className="mt-2">{t("delete-warning-2")}</p>
                  </div>
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               {innerWidth > MOBILE_BREAKPOINT && (
                  <AlertDialogCancel className="mr-auto">
                     {tCommon("cancel")}
                  </AlertDialogCancel>
               )}
               <Button
                  disabled={isLoading}
                  onClick={() => onDelete({ organizationId: organization.id })}
                  className="w-fit"
                  variant={"destructive"}
               >
                  {t("delete-title")}
                  {isLoading && <Loading />}
               </Button>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}
