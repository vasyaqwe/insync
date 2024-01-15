import { useFormValidation } from "@/hooks/use-form-validation"
import { updateCardSchema } from "@/lib/validations/card"
import { useRouter } from "@/navigation"
import { api } from "@/trpc/react"
import { type Card } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

export function useUpdateCard({
   card,
   onSuccess,
}: {
   card: Card
   onSuccess?: () => void
}) {
   const t = useTranslations("cards")
   const router = useRouter()
   const utils = api.useUtils()
   const [formData, setFormData] = useState({
      name: card.name,
      cardId: card.id,
      description: card.description ?? "",
   })

   const { mutate: onUpdate, isLoading: isUpdateLoading } =
      api.card.update.useMutation({
         onSuccess: async ({ name, description }) => {
            void utils.card.getAuditLogs.invalidate()
            if (description) {
               setFormData((prev) => ({ ...prev, description }))
            }
            onSuccess?.()
            toast.success(t.rich("update-success", { name }))
            router.refresh()
         },
         onError: () => {
            return toast.error(t("update-error"))
         },
      })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () => onUpdate(formData),
      formData,
      zodSchema: updateCardSchema,
   })

   return {
      onUpdate,
      isUpdateLoading,
      safeOnSubmit,
      errors,
      formData,
      setFormData,
   }
}
