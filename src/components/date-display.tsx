"use client"

import { isDateToday } from "@/lib/utils"
import { useFormatter, useNow } from "next-intl"

type DateProps = Omit<React.ComponentProps<"small">, "children"> & {
   children: Date
   justNowText: string
}

export function DateDisplay({ children, justNowText, ...props }: DateProps) {
   const format = useFormatter()
   const now = useNow({
      // Update every minute
      updateInterval: 1000 * 60,
   })

   function formatDate(dateInput: Date) {
      const date = Number(dateInput)
      if (!isNaN(date)) {
         const diffInMinutes = Math.floor((Date.now() - date) / 60000)
         if (diffInMinutes < 2) {
            return justNowText
         } else if (isDateToday(dateInput)) {
            return format.relativeTime(date, { now })
         } else {
            return format.dateTime(date, {
               day: "numeric",
               month: "short",
               hour: "numeric",
               minute: "numeric",
               hour12: false,
            })
         }
      } else {
         return "Invalid date"
      }
   }

   return (
      <span
         suppressHydrationWarning
         {...props}
      >
         {formatDate(children)}
      </span>
   )
}
