"use client"

import { useOrganizationHelpers } from "@/hooks/use-organization-helpers"
import { useRouter } from "@/navigation"
import { useEffect } from "react"

export function DashboardRedirect() {
   const router = useRouter()
   const { lastVisitedOrganizationId } = useOrganizationHelpers()

   useEffect(() => {
      router.push(`/dashboard/${lastVisitedOrganizationId}`)
   }, [router, lastVisitedOrganizationId])

   return null
}
