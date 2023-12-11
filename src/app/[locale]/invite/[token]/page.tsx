import { InvitationActions } from "@/components/forms/invitation-actions"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import { pick } from "@/lib/utils"
import { Link } from "@/navigation"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import logo from "@public/logo-large.svg"
import { XCircle } from "lucide-react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import Image from "next/image"

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
      (invitation.invitedUserEmail !== user?.emailAddresses[0]?.emailAddress &&
         user)
   ) {
      return (
         <div className="px-6 py-10 text-center">
            <Link href={"/"}>
               <Image
                  src={logo}
                  alt="insync."
                  className="mx-auto "
               />
            </Link>
            <XCircle
               size={100}
               className="mx-auto mt-10 stroke-destructive/80"
            />
            <h1 className="text-balance mt-5 text-2xl font-semibold sm:text-3xl md:text-5xl">
               {t("error-title")}
            </h1>
            <div className="mx-auto max-w-[65ch]">
               <p className="mt-10 text-lg">{t("error-1")}</p>
               <p className="mt-10 text-foreground/75">{t("error-2")}</p>
            </div>
            <Button asChild>
               <Link
                  className="mt-8"
                  href={"/dashboard"}
               >
                  {t("error-button")}
               </Link>
            </Button>
         </div>
      )
   }

   const organizationName = invitation.organization.name
   const messages = (await getMessages()) as Messages

   return (
      <div className="px-6 py-10 text-center">
         <Link href={"/"}>
            <Image
               src={logo}
               alt="insync."
               className="mx-auto "
            />
         </Link>
         <h1
            className="text-balance mt-10 text-2xl font-semibold sm:text-3xl md:text-5xl"
            dangerouslySetInnerHTML={{
               __html: t.markup("title", {
                  organizationName: organizationName,
                  span: (chunks) =>
                     `<span class='text-primary'>${chunks}</span>`,
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
