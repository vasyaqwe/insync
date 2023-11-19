"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { type AvatarProps } from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"
import { type User } from "@clerk/nextjs/server"

type UserAvatarProps = {
   user: User
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
            "h-[var(--avatar-size)] w-[var(--avatar-size)]",
            className
         )}
      >
         {user.imageUrl ? (
            <Image
               width={size}
               height={size}
               src={user.imageUrl}
               alt={user.firstName + " " + user.lastName ?? "user's avatar"}
               referrerPolicy="no-referrer"
               className="w-full rounded-full object-cover"
            />
         ) : (
            <AvatarFallback className="text-[calc(var(--avatar-size)/2.5)]">
               {user.firstName ? user.firstName[0] : "U"}
            </AvatarFallback>
         )}
      </Avatar>
   )
}
