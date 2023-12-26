"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@/navigation"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { useIsHydrated } from "@/hooks/use-is-hydrated"

export function BackToDashboardLink({
   text,
   className,
}: { text: string } & ButtonProps) {
   const { lastVisitedOrganizationId } = useOrganizationHelpersStore()
   const { isHydrated } = useIsHydrated()

   return isHydrated ? (
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
