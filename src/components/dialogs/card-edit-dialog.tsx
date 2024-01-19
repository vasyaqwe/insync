import { Button } from "@/components/ui/button"
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"

import { useTranslations } from "next-intl"

import { useUpdateCard } from "@/hooks/use-update-card"
import { ErrorMessage, Input } from "@/components/ui/input"
import { type ExtendedCard, NAME_CHARS_LIMIT } from "@/lib/validations/card"
import { toast } from "sonner"

type CardDialogProps = {
   card: ExtendedCard
   open: boolean
   setOpen: (open: boolean) => void
}

export default function CardEditDialog({
   card,
   setOpen,
   open,
}: CardDialogProps) {
   const t = useTranslations("cards")
   const tCommon = useTranslations("common")

   const { safeOnSubmit, errors, formData, setFormData } = useUpdateCard({
      card,
      onSuccess: () => {
         toast.success(t.rich("update-success", { name: card.name }))
         setOpen(false)
      },
      onError: () => {
         setOpen(true)
      },
   })

   return (
      <Dialog
         open={open}
         onOpenChange={(open) => {
            if (!open) {
               setFormData((prev) => ({
                  ...prev,
                  name: card.name,
               }))
               setOpen(false)
            } else {
               setOpen(true)
            }
         }}
      >
         <DialogContent className="max-w-sm">
            <DialogHeader>
               <DialogTitle>
                  {tCommon("edit")} {tCommon("card")}
               </DialogTitle>
            </DialogHeader>
            <form
               className="mt-5"
               onSubmit={(e) => {
                  e.preventDefault()
                  safeOnSubmit()
               }}
            >
               <Input
                  invalid={errors.name}
                  value={formData.name}
                  onChange={(e) =>
                     setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                     }))
                  }
                  placeholder={t("new-card-label")}
               />
               <ErrorMessage
                  error={{
                     message: errors.name,
                     dynamicParams: {
                        limit: NAME_CHARS_LIMIT,
                     },
                  }}
               />
               <Button
                  type={"submit"}
                  className="mt-3 w-full"
               >
                  {tCommon("update")}
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   )
}
