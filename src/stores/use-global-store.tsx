import { create } from "zustand"

const dialogs = {
   createOrganization: false,
}

export type Dialog = keyof typeof dialogs
type StoreState = {
   openDialog: (dialog: Dialog) => void
   closeDialog: (dialog: Dialog) => void
   dialogs: typeof dialogs
}

export const useGlobalStore = create<StoreState>()((set) => ({
   dialogs,
   openDialog: (dialog) => {
      set((state) => ({ dialogs: { ...state.dialogs, [dialog]: true } }))
   },
   closeDialog: (dialog) => {
      set((state) => ({
         dialogs: { ...state.dialogs, [dialog]: false },
      }))
   },
}))
