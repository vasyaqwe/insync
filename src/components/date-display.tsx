"use client"

import { isDateToday } from "@/lib/utils"
import { useFormatter, useNow } from "next-intl"
import { useEffect, useState } from "react"

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
   const [currentDate, setCurrentDate] = useState(new Date())

   useEffect(() => {
      setCurrentDate(new Date())
   }, [])

   function formatDate(dateInput: Date) {
      const date = Number(dateInput)
      if (!isNaN(date)) {
         const diffInMinutes = Math.floor(
            (currentDate.getTime() - date) / 60000
         )

         if (diffInMinutes < 2) {
            return justNowText
         } else if (isDateToday(dateInput)) {
            //sometimes now value is a few mins early, this is a workarond
            return format.relativeTime(date, {
               now: currentDate <= now ? now : currentDate,
            })
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
