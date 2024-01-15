"use client"

import { UserAvatar } from "@/components/ui/user-avatar"
import { type Organization, type User } from "@prisma/client"
import { useTranslations } from "next-intl"
import { Hint } from "@/components/hint"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import dynamic from "next/dynamic"

const OrganizationMembersDialogContent = dynamic(
   () => import("@/components/dialogs/organization-members-dialog-content"),
   {
      ssr: false,
   }
)

type MembersProps = {
   members: User[]
   organization: Pick<Organization, "id" | "name" | "ownerId"> & {
      members: User[]
   }
}

export function OrganizationMembersDialog({
   members,
   organization,
}: MembersProps) {
   const t = useTranslations("members")
   const [open, setOpen] = useState(false)

   return (
      <Dialog
         onOpenChange={setOpen}
         open={open}
      >
         <Hint content={t("tooltip")}>
            <DialogTrigger asChild>
               <button className="flex items-center rounded-lg border bg-card px-2 py-1 transition-colors hover:bg-accent">
                  {members.map((m, idx, arr) => (
                     <UserAvatar
                        key={m.id}
                        style={{ zIndex: arr.length - idx }}
                        className={
                           "[--avatar-size:35px] [&:not(:first-child)]:-ml-3"
                        }
                        user={m}
                     />
                  ))}
                  <span className="ml-2 font-medium"> {members.length}</span>
               </button>
            </DialogTrigger>
         </Hint>
         <OrganizationMembersDialogContent
            setOpen={setOpen}
            members={members}
            organization={organization}
         />
      </Dialog>
   )
}
