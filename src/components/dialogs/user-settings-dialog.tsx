import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { useGlobalStore } from "@/stores/use-global-store"
import { useShallow } from "zustand/react/shallow"

export function UserSettingsDialog() {
   const { open, closeDialog, openDialog } = useGlobalStore(
      useShallow((state) => ({
         closeDialog: state.closeDialog,
         openDialog: state.openDialog,
         open: state.dialogs.userSettings,
      }))
   )

   return (
      <Dialog
         onOpenChange={(open) => {
            if (!open) {
               closeDialog("userSettings")
            } else {
               openDialog("userSettings")
            }
         }}
         open={open}
      >
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle className="text-2xl font-semibold">
                  Settings
               </DialogTitle>
               <DialogDescription className="mt-3 text-sm text-foreground/70">
                  Edit your public information here.
               </DialogDescription>
            </DialogHeader>
         </DialogContent>
      </Dialog>
   )
}
