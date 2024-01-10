import { BackToDashboardLink } from "@/components/actions/back-to-dashboard-link"
import { InvitationActions } from "@/components/forms/invitation-actions"
import { Icons } from "@/components/ui/icons"
import { UserAvatar } from "@/components/ui/user-avatar"
import { pick } from "@/lib/utils"
import { Link } from "@/navigation"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { XCircle } from "lucide-react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function Page({
   params: { token, locale },
}: {
   params: { token: string; locale: string }
}) {
   const user = await currentUser()
   const t = await getTranslations("invite")

   const invitation = await db.organizationInvitation.findUnique({
      where: {
         token,
      },
      include: {
         sender: true,
         organization: true,
      },
   })

   if (
      !invitation ||
      (user &&
         invitation.invitedUserEmail !== user.emailAddresses[0]?.emailAddress)
   ) {
      return (
         <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <Link
               href={user ? "/dashboard" : "/"}
               className="mx-auto w-fit"
            >
               <Icons.logo
                  width={200}
                  height={40}
               />
            </Link>
            <XCircle
               size={100}
               className="mx-auto mt-10 stroke-destructive/80"
            />
            <h1 className="mt-5 text-balance text-2xl font-semibold sm:text-3xl md:text-5xl">
               {t("error-title")}
            </h1>
            <div className="mx-auto max-w-[65ch]">
               <p className="mt-10 text-lg">{t("error-1")}</p>
               <p className="mt-10 text-muted-foreground">{t("error-2")}</p>
            </div>
            <BackToDashboardLink
               className="mt-8"
               text={t("error-button")}
            />
         </div>
      )
   }

   const organizationName = invitation.organization.name
   const messages = (await getMessages()) as Messages

   return (
      <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
         <Link
            className="mx-auto w-fit"
            href={user ? "/dashboard" : "/"}
         >
            <Icons.logo
               width={200}
               height={40}
            />
         </Link>
         <h1
            className="mt-10 text-balance text-2xl font-semibold sm:text-3xl md:text-5xl"
            dangerouslySetInnerHTML={{
               __html: t.markup("title", {
                  organizationName: organizationName,
                  span: (chunks) =>
                     `<span class='accent-text'>${chunks}</span>`,
               }),
            }}
         ></h1>
         <p
            dangerouslySetInnerHTML={{ __html: t.raw("description") }}
            className="mt-5 text-foreground/75 md:mt-8"
         ></p>

         <div className="mt-5 flex flex-col items-center justify-center gap-2 md:mt-8">
            <UserAvatar
               className="[--avatar-size:50px]"
               user={invitation.sender}
            />
            <p
               dangerouslySetInnerHTML={{
                  __html: t.markup("invited-you", {
                     name: invitation.sender.firstName,
                     organization: organizationName,
                     strong: (chunks) =>
                        `<strong class="font-semibold">${chunks}</strong>`,
                  }),
               }}
               className="text-foreground/90"
            ></p>
         </div>
         <div className="mt-5 flex justify-center md:mt-8">
            <NextIntlClientProvider messages={pick(messages, ["invite"])}>
               <InvitationActions
                  locale={locale}
                  invitationId={invitation.id}
                  token={invitation.token}
                  organizationId={invitation.organizationId}
               />
            </NextIntlClientProvider>
         </div>
      </div>
   )
}
