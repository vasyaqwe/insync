export function useOrganizationHelpers() {
   if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const storedValue = localStorage.getItem("last-visited-organization-id")
      const parsedValue = storedValue ? JSON.parse(storedValue) : ""

      return { lastVisitedOrganizationId: parsedValue }
   }

   return ""
}
