import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { useEffect, useState } from "react"

export const useIsHydrated = () => {
   const [isHydrated, setIsHydrated] = useState(false)

   // Rehydrate the store on page load
   useEffect(() => {
      void useOrganizationHelpersStore.persist.rehydrate()
      setIsHydrated(true)
   }, [])

   return { isHydrated }
}
