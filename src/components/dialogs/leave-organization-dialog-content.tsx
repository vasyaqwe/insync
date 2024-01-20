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
import { useRouter } from "@/navigation"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { api } from "@/trpc/react"
import { type Organization } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useTransition } from "react"
import { toast } from "sonner"

export default function LeaveOrganizationDialogContent({
   organization,
}: {
   organization: Pick<Organization, "name" | "id">
}) {
   const t = useTranslations("organization-settings")
   const tCommon = useTranslations("common")
   const router = useRouter()
   const [isPending, startTransition] = useTransition()
   const { removeExpandedOrganizations } = useOrganizationHelpersStore()

   const { isPending: isMutationPending, mutate: onLeave } =
      api.organization.leave.useMutation({
         onSuccess: ({
            leftOrganizationName,
            leftOrganizationId,
            firstOrganizationId,
         }) => {
            startTransition(() => {
               router.push(`/dashboard/${firstOrganizationId}`)
            })
            router.refresh()
            toast.success(
               t.rich("leave-success-toast", { name: leftOrganizationName })
            )
            removeExpandedOrganizations(leftOrganizationId)
         },
         onError: () => {
            toast.error(t("leave-error-toast"))
         },
      })

   return (
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
               disabled={isPending || isMutationPending}
               onClick={() => onLeave({ organizationId: organization.id })}
               className="w-fit"
            >
               {t("leave-title")}
               {(isPending || isMutationPending) && <Loading />}
            </Button>
         </AlertDialogFooter>
      </AlertDialogContent>
   )
}
