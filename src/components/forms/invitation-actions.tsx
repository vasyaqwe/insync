"use client"

import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { type AcceptOrganizationInvitationSchema } from "@/lib/validations/organization"
import { useRouter } from "@/navigation"
import { api } from "@/trpc/react"
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/nextjs"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { ClerkWrapper } from "@/components/clerk-helpers"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"

function InvitationActions({
   invitationId,
   organizationId,
   token,
   locale,
}: AcceptOrganizationInvitationSchema & { locale: string }) {
   const t = useTranslations("invite")
   const router = useRouter()
   const searchParams = useSearchParams()
   const { setExpandedOrganizations } = useOrganizationHelpersStore()

   const mode = searchParams.get("mode")

   const { isLoading, mutate: onAccept } = api.organization.join.useMutation({
      onSuccess: () => {
         router.push(`/dashboard/${organizationId}`)
         setExpandedOrganizations(organizationId)
         router.refresh()
         toast.success(t("success-toast"))
      },
      onError: () => {
         toast.error(t("error-toast"))
      },
   })

   return (
      <>
         <SignedOut>
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
         </SignedOut>
         <SignedIn>
            <Button
               disabled={isLoading}
               onClick={() => onAccept({ invitationId, organizationId, token })}
               size={"lg"}
            >
               {t("accept")}
               {isLoading && <Loading />}
            </Button>
         </SignedIn>
      </>
   )
}

export { InvitationActions }
