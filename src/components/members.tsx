"use client"

import { UserAvatar } from "@/components/ui/user-avatar"
import { type User } from "@prisma/client"
import { useTranslations } from "next-intl"
import { Hint } from "@/components/hint"
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
   Command,
   CommandGroup,
   CommandItem,
   CommandList,
} from "@/components/ui/command"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { InviteCommand } from "@/components/invite-command"
import { type InvitedUser } from "@/lib/validations/organization"
import { ArrowLeft, UserPlus } from "lucide-react"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import { Loading } from "@/components/ui/loading"

type MembersProps = {
   members: User[]
   name: string
   entityId: string
}

export function Members({ members, name, entityId }: MembersProps) {
   const t = useTranslations("members")
   const [open, setOpen] = useState(false)
   const { user: currentUser } = useUser()

   const [selectedUsers, setSelectedUsers] = useState<InvitedUser[]>([])
   const [tab, setTab] = useState<"invite" | "members">("members")

   const { mutate: onSubmit, isLoading } = api.organization.invite.useMutation({
      onSuccess: () => {
         setOpen(false)
         setSelectedUsers([])
         setTab("members")
         toast.success(t("success"))
      },
      onError: () => {
         return toast.error(t("error"))
      },
   })

   return (
      <Dialog
         onOpenChange={setOpen}
         open={open}
      >
         <Hint content={t("tooltip")}>
            <DialogTrigger asChild>
               <button className="flex items-center rounded-lg border bg-card px-2 py-1 transition-colors hover:bg-accent">
                  {members.map((m) => (
                     <UserAvatar
                        key={m.id}
                        className={
                           "[--avatar-size:35px] [&:not(:first-child)]:-ml-1"
                        }
                        user={m}
                     />
                  ))}
                  <span className="ml-2 font-medium"> {members.length}</span>
               </button>
            </DialogTrigger>
         </Hint>
         <DialogContent
            onAnimationEndCapture={() => {
               setTab("members")
            }}
            className="min-h-[400px]"
         >
            <DialogHeader className="flex items-center gap-2">
               {tab === "invite" && (
                  <Button
                     size={"icon"}
                     variant={"ghost"}
                     onClick={() => setTab("members")}
                     title={t("back")}
                  >
                     <ArrowLeft
                        size={18}
                        className="align-middle"
                     />
                  </Button>
               )}
               <DialogTitle>{t.rich(`title-${tab}`, { name })}</DialogTitle>
            </DialogHeader>
            {tab === "members" ? (
               <Command className="mt-5">
                  <CommandList>
                     <CommandGroup className="p-0">
                        <CommandItem
                           onSelect={() => setTab("invite")}
                           className="flex items-center gap-2"
                           value={t("invite")}
                        >
                           <div className="grid h-[var(--avatar-size)] w-[var(--avatar-size)] flex-shrink-0 place-content-center rounded-full bg-primary/10 text-primary">
                              <UserPlus size={18} />
                           </div>
                           <div className="w-full">
                              <p className="truncate">{t("invite")}</p>
                           </div>
                        </CommandItem>
                        {members.map((user) => (
                           <CommandItem
                              key={user.id}
                              className="flex items-center gap-2"
                              value={user.email}
                           >
                              <UserAvatar user={user} />
                              <div className="w-full">
                                 <p className="truncate">
                                    {user.firstName} {user.lastName}{" "}
                                    {user.id === currentUser?.id
                                       ? `(${t("you")})`
                                       : ""}
                                 </p>
                                 <p className="line-clamp-1 flex w-full items-center break-all text-foreground/75">
                                    {user.email}
                                 </p>
                              </div>

                              {/* <span
                           className={cn(
                              "ml-auto grid h-6 w-6 flex-shrink-0 place-content-center rounded-full bg-primary",
                           )}
                        >
                           <Chec
                              size={16}
                              className="stroke-background"
                           />
                        </span> */}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : (
               <InviteCommand
                  className="mt-5"
                  setSelectedUsers={setSelectedUsers}
                  selectedUsers={selectedUsers}
               />
            )}

            {tab === "invite" && (
               <div className="mt-5 flex items-center justify-between">
                  {selectedUsers.length < 1 ? (
                     <p className="text-sm text-foreground/75">
                        {t("selected-users-empty")}
                     </p>
                  ) : (
                     <div className="flex items-center pl-3">
                        {selectedUsers.map((user) => (
                           <UserAvatar
                              className="-ml-3"
                              user={user}
                              key={user.email}
                           />
                        ))}
                     </div>
                  )}
                  <Button
                     onClick={() =>
                        onSubmit({
                           organizationId: entityId,
                           invitedUsers: selectedUsers,
                        })
                     }
                     disabled={selectedUsers.length < 1 || isLoading}
                  >
                     {t("send-invites")}
                     {isLoading && <Loading />}
                  </Button>
               </div>
            )}
         </DialogContent>
      </Dialog>
   )
}
