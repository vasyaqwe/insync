"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { type AvatarProps } from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"
import { type User } from "@prisma/client"

type DeepPartial<T> = T extends object
   ? {
        [P in keyof T]?: DeepPartial<T[P]>
     }
   : T

type UserAvatarProps = {
   user: DeepPartial<User>
   showActiveIndicator?: boolean
} & AvatarProps

export function UserAvatar({ user, className, ...props }: UserAvatarProps) {
   const size =
      typeof window !== "undefined"
         ? +getComputedStyle(document.documentElement)
              .getPropertyValue("--avatar-size")
              .replace("px", "") ?? 40
         : 40

   return (
      <Avatar
         {...props}
         className={cn(
            "h-[var(--avatar-size)] w-[var(--avatar-size)] border",
            user.imageUrl ? "border-transparent" : "border-muted-foreground/75",
            className
         )}
      >
         {user.imageUrl ? (
            <Image
               width={size}
               height={size}
               src={user.imageUrl}
               alt={`${user.firstName}'s avatar` ?? "user's avatar"}
               referrerPolicy="no-referrer"
               className={cn("w-full rounded-full object-cover")}
            />
         ) : (
            <AvatarFallback className="text-[calc(var(--avatar-size)/2.5)]">
               {user.email?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
         )}
      </Avatar>
   )
}
