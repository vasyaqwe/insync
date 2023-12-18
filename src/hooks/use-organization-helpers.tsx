import { useEffect, useState } from "react"

export function useOrganizationHelpers() {
   const [lastVisitedOrganizationId, setLastVisitedOrganizationId] =
      useState("")

   useEffect(() => {
      if (
         typeof window !== "undefined" &&
         typeof localStorage !== "undefined"
      ) {
         const storedValue = localStorage.getItem(
            "last-visited-organization-id"
         )
         const parsedValue = storedValue ? JSON.parse(storedValue) : ""
         setLastVisitedOrganizationId(parsedValue)
      }
   }, [])

   return { lastVisitedOrganizationId }
}
