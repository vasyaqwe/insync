import { useFormValidation } from "@/hooks/use-form-validation"
import { type ExtendedCard, updateCardSchema } from "@/lib/validations/card"
import { api } from "@/trpc/react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

export function useUpdateCard({
   card,
   onSuccess,
   onSettled,
   onError,
}: {
   card: ExtendedCard
   onSuccess?: () => void
   onSettled?: () => void
   onError?: () => void
}) {
   const t = useTranslations("cards")
   const utils = api.useUtils()

   const [formData, setFormData] = useState({
      name: card.name,
      cardId: card.id,
      description: card.description ?? "",
   })

   const { mutate: onUpdate, isLoading: isUpdateLoading } =
      api.card.update.useMutation({
         onMutate: async ({ name, description }) => {
            await utils.board.getAll.cancel()
            const previousLists = utils.list.getAll.getData({
               boardId: card.list.boardId,
            })
            console.log(previousLists)
            utils.list.getAll.setData(
               { boardId: card.list.boardId },
               (oldQueryData) =>
                  oldQueryData?.map((oldList) =>
                     oldList.id === card.listId
                        ? {
                             ...oldList,
                             cards: oldList.cards.map((oldCard) =>
                                oldCard.id === card.id
                                   ? {
                                        ...oldCard,
                                        name,
                                        description: description ?? "",
                                     }
                                   : oldCard
                             ),
                          }
                        : oldList
                  )
            )

            onSuccess?.()

            return { previousLists }
         },
         onError: (_err, _data, context) => {
            utils.list.getAll.setData(
               { boardId: card.list.boardId },
               context?.previousLists
            )
            onError?.()
            toast.dismiss()
            return toast.error(t("update-error"))
         },
         onSettled: () => {
            onSettled?.()
            void utils.list.getAll.invalidate()
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
