import { Button } from "@/components/ui/button"
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { Loading } from "@/components/ui/loading"

import { useTranslations } from "next-intl"

import { type Card } from "@prisma/client"
import { useUpdateCard } from "@/hooks/use-update-card"
import { ErrorMessage, Input } from "@/components/ui/input"
import { NAME_CHARS_LIMIT } from "@/lib/validations/card"

type CardDialogProps = {
   card: Card
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

   const { isUpdateLoading, safeOnSubmit, errors, formData, setFormData } =
      useUpdateCard({
         card,
         onSuccess: () => {
            setOpen(false)
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
         <DialogContent>
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
                  disabled={isUpdateLoading}
                  className="mt-3 w-full"
               >
                  {isUpdateLoading ? <Loading /> : tCommon("update")}
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   )
}
