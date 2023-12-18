export function useOrganizationHelpers() {
   const lastVisitedOrganizationId =
      typeof window !== "undefined" && typeof localStorage !== "undefined"
         ? JSON.parse(
              localStorage.getItem("last-visited-organization-id") ?? ""
           )
         : ""

   return { lastVisitedOrganizationId }
}
