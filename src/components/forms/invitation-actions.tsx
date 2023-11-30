"use client"

import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { type AcceptOrganizationInvitationSchema } from "@/lib/validations/organization"
import { useRouter } from "@/navigation"
import { api } from "@/trpc/react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export function InvitationActions({
   invitationId,
   organizationId,
   token,
}: AcceptOrganizationInvitationSchema) {
   const t = useTranslations("invite")
   const router = useRouter()

   const { isLoading, mutate: onAccept } =
      api.organization.acceptInvitation.useMutation({
         onSuccess: () => {
            router.push("/dashboard")
            router.refresh()
            toast.success(t("success-toast"))
         },
         onError: () => {
            toast.error(t("error-toast"))
         },
      })

   return (
      <>
         <Button
            disabled={isLoading}
            onClick={() => onAccept({ invitationId, organizationId, token })}
            size={"lg"}
         >
            {t("accept")}
            {isLoading && <Loading />}
         </Button>
      </>
   )
}
