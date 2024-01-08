"use client"

import { useIsHydrated } from "@/hooks/use-is-hydrated"
import { useRouter } from "@/navigation"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { useEffect } from "react"

export function DashboardRedirect() {
   const router = useRouter()
   const { lastVisitedOrganizationId } = useOrganizationHelpersStore()
   const { isHydrated } = useIsHydrated()

   useEffect(() => {
      if (isHydrated) router.push(`/dashboard/${lastVisitedOrganizationId}`)
   }, [router, lastVisitedOrganizationId, isHydrated])

   return null
}
