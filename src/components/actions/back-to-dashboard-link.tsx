"use client"

import { useOrganizationHelpers } from "@/hooks/use-organization-helpers"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useIsClient } from "@/hooks/use-is-client"
import { cn } from "@/lib/utils"
import { Link } from "@/navigation"

export function BackToDashboardLink({
   text,
   className,
}: { text: string } & ButtonProps) {
   const { lastVisitedOrganizationId } = useOrganizationHelpers()
   const { isClient } = useIsClient()

   return isClient ? (
      <Button asChild>
         <Link
            className={cn("", className)}
            href={`/dashboard/${lastVisitedOrganizationId}`}
         >
            {text}
         </Link>
      </Button>
   ) : null
}
