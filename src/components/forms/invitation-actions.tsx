"use client"

import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { type AcceptOrganizationInvitationSchema } from "@/lib/validations/organization"
import { useRouter } from "@/navigation"
import { api } from "@/trpc/react"
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/nextjs"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { clerkAppearence } from "@/config"
import { useSearchParams } from "next/navigation"

function InvitationActions({
   invitationId,
   organizationId,
   token,
   locale,
}: AcceptOrganizationInvitationSchema & { locale: string }) {
   const t = useTranslations("invite")
   const router = useRouter()
   const searchParams = useSearchParams()

   const mode = searchParams.get("mode")

   const { isLoading, mutate: onAccept } = api.organization.join.useMutation({
      onSuccess: () => {
         router.push(`/dashboard/${organizationId}`)
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
            {mode === "sign-up" ? (
               <SignUp
                  signInUrl={`/${locale}/invite/${token}?mode=sign-in`}
                  redirectUrl={`/${locale}/invite/${token}`}
                  appearance={{
                     ...clerkAppearence,
                  }}
               />
            ) : (
               <SignIn
                  signUpUrl={`/${locale}/invite/${token}?mode=sign-up`}
                  redirectUrl={`/${locale}/invite/${token}`}
                  appearance={{
                     ...clerkAppearence,
                  }}
               />
            )}
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
