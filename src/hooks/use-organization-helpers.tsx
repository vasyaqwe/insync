import { useEffect, useState } from "react"

export function useOrganizationHelpers() {
   const [lastVisitedOrganizationId, setLastVisitedOrganizationId] =
      useState("")

   useEffect(() => {
      const lastVisitedOrganizationId =
         typeof window !== "undefined" && typeof localStorage !== "undefined"
            ? JSON.parse(
                 localStorage.getItem("last-visited-organization-id") ?? ""
              )
            : ""

      setLastVisitedOrganizationId(lastVisitedOrganizationId)
   }, [])

   return { lastVisitedOrganizationId }
}
