"use client"

import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { type AcceptOrganizationInvitationSchema } from "@/lib/validations/organization"
import { SignIn, SignUp, useAuth } from "@clerk/nextjs"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { ClerkWrapper } from "@/components/clerk-helpers"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { useAction } from "@/hooks/use-action"
import { acceptInvitation } from "@/lib/actions/organization"

function InvitationActions({
   invitationId,
   organizationId,
   token,
}: AcceptOrganizationInvitationSchema) {
   const t = useTranslations("invite")
   const { setExpandedOrganizations } = useOrganizationHelpersStore()

   const { isPending, execute: onAccept } = useAction(acceptInvitation, {
      onSuccess: () => {
         setExpandedOrganizations(organizationId)
         toast.success(t("success-toast"))
      },
      onError: () => {
         toast.error(t("error-toast"))
      },
   })

   return (
      <>
         <Button
            disabled={isPending}
            onClick={() => onAccept({ invitationId, organizationId, token })}
            size={"lg"}
         >
            {t("accept")}
            {isPending && <Loading />}
         </Button>
      </>
   )
}

function InvitationSignedOut({
   locale,
   token,
}: {
   token: string
   locale: string
}) {
   const searchParams = useSearchParams()
   const { isLoaded, isSignedIn } = useAuth()

   if (!isLoaded || isSignedIn) return null

   const mode = searchParams.get("mode")

   return (
      <>
         <ClerkWrapper>
            {mode === "sign-up" ? (
               <SignUp
                  signInUrl={`/${locale}/invite/${token}?mode=sign-in`}
                  redirectUrl={`/${locale}/invite/${token}`}
               />
            ) : (
               <SignIn
                  signUpUrl={`/${locale}/invite/${token}?mode=sign-up`}
                  redirectUrl={`/${locale}/invite/${token}`}
               />
            )}
         </ClerkWrapper>
      </>
   )
}

export { InvitationActions, InvitationSignedOut }
