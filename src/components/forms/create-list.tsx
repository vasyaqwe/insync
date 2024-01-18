"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { ErrorMessage, Input } from "@/components/ui/input"
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover"
import { useFormValidation } from "@/hooks/use-form-validation"
import { cn } from "@/lib/utils"
import { NAME_CHARS_LIMIT, createListSchema } from "@/lib/validations/list"
import { api } from "@/trpc/react"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import useMeasure from "react-use-measure"

export function CreateList({
   boardId,
   className,
   organizationId,
   ...props
}: { boardId: string; organizationId: string } & ButtonProps) {
   const t = useTranslations("lists")
   const tCommon = useTranslations("common")
   const utils = api.useUtils()
   const [triggerRef, { width: triggerWidth }] = useMeasure()
   const [formData, setFormData] = useState({
      name: "",
      boardId,
   })

   const { mutate: onSubmit } = api.list.create.useMutation({
      onMutate: async () => {
         await utils.list.getAll.cancel()
         const previousLists = utils.list.getAll.getData({
            boardId,
         })

         toast.success(t("create-success"))
         //close popover
         document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))

         //wait for popover exit animation to finish
         setTimeout(() => {
            utils.list.getAll.setData({ boardId }, (oldQueryData) => [
               ...(oldQueryData ?? []),
               {
                  ...formData,
                  id: "optimistic",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  cards: [],
                  order: (previousLists?.length ?? 0) + 1,
                  organizationId,
               },
            ])
         }, 100)

         return { previousLists }
      },
      onError: (_err, _data, context) => {
         utils.list.getAll.setData({ boardId }, context?.previousLists)
         toast.dismiss()
         return toast.error(t("create-error"))
      },
      onSettled: () => {
         void utils.list.getAll.invalidate()
      },
   })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () => onSubmit(formData),
      formData,
      zodSchema: createListSchema,
   })

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               ref={triggerRef}
               className={cn("mr-8 mt-6 min-w-[18rem] text-base", className)}
               variant="secondary"
               {...props}
            >
               <Plus /> {t("new-list")}
            </Button>
         </PopoverTrigger>
         <PopoverContent
            onAnimationEndCapture={() => {
               setFormData((prev) => ({ ...prev, name: "" }))
            }}
            style={{ width: triggerWidth }}
         >
            <form
               onSubmit={(e) => {
                  e.preventDefault()
                  safeOnSubmit()
               }}
            >
               <Input
                  invalid={errors.name}
                  value={formData.name}
                  onChange={(e) =>
                     setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder={t("new-list-label")}
               />
               <ErrorMessage
                  error={{
                     message: errors.name,
                     dynamicParams: { limit: NAME_CHARS_LIMIT },
                  }}
               />
               <Button className="mt-3 w-full">{tCommon("create")}</Button>
            </form>
         </PopoverContent>
      </Popover>
   )
}
