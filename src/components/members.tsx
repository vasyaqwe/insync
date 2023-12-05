"use client"

import { Card } from "@/components/ui/card"
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

type MembersProps = {
   members: User[]
   name: string
}

export function Members({ members, name }: MembersProps) {
   const { user: currentUser } = useUser()
   const t = useTranslations("members")

   return (
      <Dialog>
         <DialogTrigger>
            <Hint content={t("tooltip")}>
               <Card
                  className="px-2 py-1"
                  asChild
               >
                  <button className="flex items-center transition-colors hover:bg-accent">
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
               </Card>
            </Hint>
         </DialogTrigger>
         <DialogContent className="min-h-[400px]">
            <DialogHeader>
               <DialogTitle>{t.rich("title", { name })}</DialogTitle>
            </DialogHeader>
            <Command className="mt-5">
               <CommandList>
                  <CommandGroup className="p-0">
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
            <div className=" mt-auto">
               <Button>{t("invite")}</Button>
            </div>
         </DialogContent>
      </Dialog>
   )
}
