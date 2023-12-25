import { useLocalStorage } from "@/hooks/use-local-storage"
import { type Organization } from "@prisma/client"

export function useOrganizationHelpers(
   {
      organizations = [],
   }: {
      organizations?: Organization[]
   } = { organizations: [] }
) {
   const [lastVisitedOrganizationId, setLastVisitedOrganizationId] =
      useLocalStorage("organization", organizations[0]?.id ?? "")

   // if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
   //    const storedValue = localStorage.getItem("organization")
   //    const parsedValue = storedValue ? JSON.parse(storedValue) : ""

   //    lastVisitedOrganizationId = parsedValue
   // }

   return { lastVisitedOrganizationId, setLastVisitedOrganizationId }
}
