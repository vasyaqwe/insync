import { Board } from "@/components/board"
import { CreateBoard } from "@/components/forms/create-board"
import { OrganizationMembers } from "@/components/organization-members"
import { ColorAvatar } from "@/components/ui/color-avatar"
import { pick } from "@/lib/utils"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { CreditCard } from "lucide-react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

export default async function Page({
   params: { organizationId },
}: {
   params: { organizationId: string }
}) {
   const user = await currentUser()
   const tCommon = await getTranslations("common")
   const t = await getTranslations("boards")

   const organization = await db.organization.findFirst({
      where: {
         id: organizationId,
      },
      select: {
         id: true,
         name: true,
         members: true,
         ownerId: true,
         color: true,
         boards: true,
      },
   })

   if (!organization || !organization.members.some((m) => m.id === user?.id))
      notFound()

   const messages = (await getMessages()) as Messages

   return (
      <div>
         <NextIntlClientProvider
            messages={pick(messages, ["members", "invite-command"])}
         >
            <div className="flex items-center justify-between border-b-2 border-dotted pb-4">
               <div className="flex items-center gap-3">
                  <ColorAvatar
                     className="[--color-avatar-size:45px] lg:[--color-avatar-size:55px]"
                     color={organization.color}
                  />
                  <div>
                     <h1 className="text-xl font-medium lg:text-2xl">
                        {organization.name}
                     </h1>
                     <p className="mt-0.5 rounded-[.4rem] border border-primary/70 bg-primary/10 px-1 text-xs leading-5 text-primary shadow-sm lg:mt-1 lg:rounded-sm lg:px-1.5 lg:py-0.5 lg:text-sm">
                        <CreditCard
                           className="mb-[1px] mr-1.5 inline align-bottom"
                           size={18}
                        />
                        {tCommon("free-plan")}
                     </p>
                  </div>
               </div>
               <OrganizationMembers
                  members={organization.members}
                  organization={organization}
               />
            </div>
         </NextIntlClientProvider>
         <h2 className="mt-4 text-3xl font-medium">{t("title")}</h2>
         <div className="mt-5 grid grid-cols-fluid gap-4">
            <NextIntlClientProvider
               messages={pick(messages, ["boards", "common"])}
            >
               {organization.boards.map((board) => (
                  <Board
                     board={board}
                     key={board.id}
                  />
               ))}
               <CreateBoard
                  className={organization.boards.length < 1 ? "w-[312px]" : ""}
                  organizationId={organizationId}
               />
            </NextIntlClientProvider>
         </div>
      </div>
   )
}
