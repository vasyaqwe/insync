"use client"

import {
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { MOBILE_BREAKPOINT } from "@/config"
import { getUploadthingFileIdsFromHTML } from "@/lib/utils"
import { useRouter } from "@/navigation"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { api } from "@/trpc/react"
import { type Organization } from "@prisma/client"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export default function DeleteOrganizationDialogContent({
   organization,
}: {
   organization: Pick<Organization, "name" | "id">
}) {
   const t = useTranslations("organization-settings")
   const tCommon = useTranslations("common")
   const router = useRouter()
   const { removeExpandedOrganizations } = useOrganizationHelpersStore()

   const { mutate: onDeleteFiles } = api.uploadthing.deleteFiles.useMutation()

   const { isLoading, mutate: onDelete } = api.organization.delete.useMutation({
      onSuccess: ({
         firstOrganizationId,
         deletedOrganizationId,
         editorContents,
      }) => {
         router.push(`/dashboard/${firstOrganizationId}`)
         router.refresh()
         toast.success(t("delete-success-toast"))
         removeExpandedOrganizations(deletedOrganizationId)

         const filesToDelete = editorContents.flatMap((d) =>
            getUploadthingFileIdsFromHTML(d)
         )

         if (filesToDelete && filesToDelete.length > 0) {
            onDeleteFiles({
               fileIds: filesToDelete,
            })
         }
      },
      onError: () => {
         toast.error(t("delete-error-toast"))
      },
   })

   const innerWidth = typeof window === "undefined" ? 0 : window.innerWidth

   return (
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
   )
}
