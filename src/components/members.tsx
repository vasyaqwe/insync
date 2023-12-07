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
   CommandInput,
} from "@/components/ui/command"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { InviteCommand } from "@/components/invite-command"
import { type InvitedUser } from "@/lib/validations/organization"
import { ArrowLeft, Check, UserPlus } from "lucide-react"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import { Loading } from "@/components/ui/loading"
import { cn } from "@/lib/utils"

type MembersProps = {
   members: User[]
   name: string
   ownerId: string
   entityId: string
}

export function Members({ members, name, entityId, ownerId }: MembersProps) {
   const t = useTranslations("members")
   const [open, setOpen] = useState(false)
   const { user: currentUser } = useUser()

   const [usersToInvite, setUsersToInvite] = useState<InvitedUser[]>([])
   const [usersToKick, setUsersToKick] = useState<InvitedUser[]>([])
   const [tab, setTab] = useState<"invite" | "members">("members")

   const { mutate: onSubmit, isLoading } = api.organization.invite.useMutation({
      onSuccess: () => {
         setOpen(false)
         setUsersToInvite([])
         setTab("members")
         toast.success(t("success"))
      },
      onError: () => {
         return toast.error(t("error"))
      },
   })

   const onSelect = (user: InvitedUser) => {
      if (user.id === currentUser?.id || user.id === ownerId) return

      if (usersToKick.some((u) => u.id === user.id)) {
         setUsersToKick((prev) => prev.filter((u) => u.id !== user.id))
      } else {
         setUsersToKick((prev) => [...prev, user])
      }
   }

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
         <DialogContent
            onAnimationEndCapture={() => {
               setTab("members")
            }}
            className="h-full max-h-[475px]"
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
               <Command className="mt-5 h-full rounded-sm border shadow-sm">
                  <CommandInput
                     autoFocus
                     placeholder={t("search")}
                  />
                  <CommandList>
                     <CommandGroup>
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
                              value={`${user.email} ${user.firstName} ${user.lastName}`}
                              onSelect={() => onSelect(user)}
                           >
                              <UserAvatar user={user} />
                              <div className="w-full">
                                 <p className="truncate">
                                    {user.firstName} {user.lastName}{" "}
                                    <span className="opacity-70">
                                       {user.id === currentUser?.id
                                          ? `(${t("you")})`
                                          : user.id === ownerId
                                          ? `(${t("owner")})`
                                          : ""}
                                    </span>
                                 </p>
                                 <p className="line-clamp-1 flex w-full items-center break-all text-foreground/75">
                                    {user.email}
                                 </p>
                              </div>

                              <span
                                 className={cn(
                                    "ml-auto grid h-6 w-6 flex-shrink-0 place-content-center rounded-full bg-primary",
                                    !usersToKick.some((u) => u.id === user.id)
                                       ? "invisible"
                                       : ""
                                 )}
                              >
                                 <Check
                                    size={16}
                                    className="stroke-background"
                                 />
                              </span>
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : (
               <InviteCommand
                  className="mt-5"
                  setSelectedUsers={setUsersToInvite}
                  selectedUsers={usersToInvite}
               />
            )}

            {tab === "invite" && (
               <div className="mt-5 flex items-center justify-between">
                  {usersToInvite.length < 1 ? (
                     <p className="text-sm text-foreground/75">
                        {t("selected-users-empty")}
                     </p>
                  ) : (
                     <div className="flex items-center pl-3">
                        {usersToInvite.map((user) => (
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
                           organizationName: name,
                           invitedUsers: usersToInvite,
                        })
                     }
                     disabled={usersToInvite.length < 1 || isLoading}
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
