import { useEffect, useState } from "react"

export function useOrganizationHelpers() {
   const [lastVisitedOrganizationId, setLastVisitedOrganizationId] =
      useState("")

   useEffect(() => {
      const lastVisitedOrganizationId = ""
      console.log(window, localStorage)
      setLastVisitedOrganizationId(lastVisitedOrganizationId)
   }, [])

   return { lastVisitedOrganizationId }
}
