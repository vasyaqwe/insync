export function useOrganizationHelpers() {
   let lastVisitedOrganizationId = ""

   if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const storedValue = localStorage.getItem("organization")
      const parsedValue = storedValue ? JSON.parse(storedValue) : ""

      lastVisitedOrganizationId = parsedValue
   }

   return { lastVisitedOrganizationId }
}
