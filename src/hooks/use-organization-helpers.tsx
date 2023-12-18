export function useOrganizationHelpers() {
   let lastVisitedOrganizationId = ""

   if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const storedValue = localStorage.getItem("last-visited-organization-id")
      const parsedValue = storedValue ? JSON.parse(storedValue) : ""

      lastVisitedOrganizationId = parsedValue
   }

   return { lastVisitedOrganizationId }
}
