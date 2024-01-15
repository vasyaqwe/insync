"use client"

import { UserAvatar } from "@/components/ui/user-avatar"
import { type Organization, type User } from "@prisma/client"
import { useTranslations } from "next-intl"
import {
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
   Command,
   CommandGroup,
   CommandItem,
   CommandList,
   CommandInput,
   CommandEmpty,
} from "@/components/ui/command"
import { type Dispatch, type SetStateAction, useState } from "react"
import { InviteCommand } from "@/components/invite-command"
import { type CommandItemUser } from "@/lib/validations/organization"
import { ArrowLeft, Check, UserPlus } from "lucide-react"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import { Loading } from "@/components/ui/loading"
import { cn } from "@/lib/utils"
import { useRouter } from "@/navigation"
import { MOBILE_BREAKPOINT } from "@/config"
import { useUser } from "@clerk/nextjs"

type MembersProps = {
   members: User[]
   organization: Pick<Organization, "id" | "name" | "ownerId"> & {
      members: User[]
   }
   setOpen: Dispatch<SetStateAction<boolean>>
}

export default function OrganizationMembersDialogContent({
   members,
   organization,
   setOpen,
}: MembersProps) {
   const t = useTranslations("members")
   const router = useRouter()
   const { user: currentUser } = useUser()

   const [usersToInvite, setUsersToInvite] = useState<CommandItemUser[]>([])
   const [membersToRemove, setMembersToRemove] = useState<CommandItemUser[]>([])
   const [tab, setTab] = useState<"invite" | "members">("members")

   const { mutate: onSendInvites, isLoading: isSendInvitesLoading } =
      api.organization.invite.useMutation({
         onSuccess: () => {
            setOpen(false)
            toast.success(t("success-invites"))
         },
         onError: () => {
            return toast.error(t("error-invites"))
         },
      })

   const { mutate: onRemoveMembers, isLoading: isRemoveMembersLoading } =
      api.organization.removeMembers.useMutation({
         onSuccess: () => {
            setOpen(false)
            toast.success(t("success-remove-members"))
            router.refresh()
         },
         onError: () => {
            return toast.error(t("error-remove-members"))
         },
      })

   const onSelect = (user: CommandItemUser) => {
      if (
         user.id === currentUser?.id ||
         user.id === organization.ownerId ||
         currentUser?.id !== organization.ownerId
      )
         return

      if (membersToRemove.some((u) => u.id === user.id)) {
         setMembersToRemove((prev) => prev.filter((u) => u.id !== user.id))
      } else {
         setMembersToRemove((prev) => [...prev, user])
      }
   }

   const innerWidth = typeof window === "undefined" ? 0 : window.innerWidth

   return (
      <DialogContent
         className="max-md:min-h-[90svh]"
         onAnimationEndCapture={() => {
            setTab("members")
            setUsersToInvite([])
            setMembersToRemove([])
         }}
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
            <DialogTitle className="min-h-[36px]">
               {t.rich(`title-${tab}`, { name: organization.name })}
            </DialogTitle>
         </DialogHeader>
         {tab === "members" ? (
            <Command className="mt-5 flex-grow md:h-[355px]">
               <CommandInput
                  autoFocus={innerWidth > MOBILE_BREAKPOINT}
                  placeholder={t("search")}
               />
               <CommandList>
                  <CommandEmpty className="p-2 text-start text-muted-foreground">
                     {t("empty")}
                  </CommandEmpty>
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
                                       : user.id === organization.ownerId
                                       ? `(${t("owner")})`
                                       : ""}
                                 </span>
                              </p>
                              <p className="line-clamp-1 flex w-full items-center break-all text-muted-foreground">
                                 {user.email}
                              </p>
                           </div>

                           <span
                              className={cn(
                                 "ml-auto grid h-6 w-6 flex-shrink-0 place-content-center rounded-full bg-primary",
                                 !membersToRemove.some((u) => u.id === user.id)
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
               existingUserEmails={organization.members.map((m) => m.email)}
               className="mt-5"
               setSelectedUsers={setUsersToInvite}
               selectedUsers={usersToInvite}
            />
         )}

         {tab === "members" && organization.ownerId === currentUser?.id ? (
            <div className="mt-5 flex min-h-[var(--avatar-size)] items-center justify-between gap-3">
               {membersToRemove.length < 1 ? (
                  <p className="text-sm text-muted-foreground">
                     {t("members-to-remove-empty")}
                  </p>
               ) : (
                  <div className="flex items-center pl-3">
                     {membersToRemove.map((user) => (
                        <UserAvatar
                           className="-ml-3"
                           user={user}
                           key={user.email}
                        />
                     ))}
                  </div>
               )}
               <Button
                  variant={"destructive"}
                  onClick={() =>
                     onRemoveMembers({
                        organizationId: organization.id,
                        memberIdsToRemove: membersToRemove.map((u) => u.id),
                     })
                  }
                  disabled={
                     membersToRemove.length < 1 || isRemoveMembersLoading
                  }
               >
                  {t("remove")}
                  {isRemoveMembersLoading && <Loading />}
               </Button>
            </div>
         ) : tab === "invite" ? (
            <div className="mt-5 flex min-h-[var(--avatar-size)] items-center justify-between gap-3">
               {usersToInvite.length < 1 ? (
                  <p className="text-sm text-muted-foreground">
                     {t("users-to-invite-empty")}
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
                     onSendInvites({
                        organizationId: organization.id,
                        organizationName: organization.name,
                        invitedUsers: usersToInvite,
                     })
                  }
                  disabled={usersToInvite.length < 1 || isSendInvitesLoading}
               >
                  {t("send-invites")}
                  {isSendInvitesLoading && <Loading />}
               </Button>
            </div>
         ) : null}
      </DialogContent>
   )
}
