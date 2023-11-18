"use client"

import { cn } from "@/lib/utils"
import { type AppPathnames, Link as NextLink } from "@/navigation"
import { useSelectedLayoutSegment } from "next/navigation"
import { type ComponentProps } from "react"

export function Link<Pathname extends AppPathnames>({
   href,
   ...rest
}: ComponentProps<typeof NextLink<Pathname>>) {
   const selectedLayoutSegment = useSelectedLayoutSegment()
   const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/"
   const isActive = pathname === href

   return (
      <NextLink
         aria-current={isActive ? "page" : undefined}
         className={cn(
            "inline-block px-2 py-3 transition-colors",
            isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
         )}
         href={href}
         {...rest}
      />
   )
}
