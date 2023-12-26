import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type StoreState = {
   lastVisitedOrganizationId: string
   setLastVisitedOrganizationId: (id: string | undefined) => void
   expandedOrganizations: Record<string, boolean>
   setExpandedOrganizations: (id: string) => void
   removeExpandedOrganizations: (id: string) => void
}

export const useOrganizationHelpersStore = create<StoreState>()(
   persist(
      (set) => ({
         lastVisitedOrganizationId: "",
         setLastVisitedOrganizationId: (id) => {
            set(() => ({ lastVisitedOrganizationId: id ?? "" }))
         },
         expandedOrganizations: {},
         setExpandedOrganizations: (id) => {
            set((state) => ({
               ...state,
               expandedOrganizations: {
                  ...state.expandedOrganizations,
                  [id]: !state.expandedOrganizations[id],
               },
            }))
         },
         removeExpandedOrganizations: (id) => {
            set((state) => {
               const newExpandedOrganizations = {
                  ...state.expandedOrganizations,
               }
               delete newExpandedOrganizations[id]

               return {
                  ...state,
                  expandedOrganizations: newExpandedOrganizations,
               }
            })
         },
      }),
      {
         skipHydration: true,
         name: "organization",
         storage: createJSONStorage(() => localStorage),
      }
   )
)
