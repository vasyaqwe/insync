export function useOrganizationHelpers() {
   const lastVisitedOrganizationId =
      typeof window !== "undefined"
         ? JSON.parse(
              localStorage.getItem("last-visited-organization-id") ?? ""
           )
         : ""

   return { lastVisitedOrganizationId }
}
