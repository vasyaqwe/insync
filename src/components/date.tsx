"use client"

import { useFormatter } from "next-intl"

type DateProps = React.ComponentProps<"small"> & { date: Date }

export function DateDisplay({ children, date, ...props }: DateProps) {
   const format = useFormatter()

   return (
      <span
         suppressHydrationWarning
         {...props}
      >
         {format.dateTime(date, {
            month: "short",
            day: "numeric",
         })}
         {children}
      </span>
   )
}
