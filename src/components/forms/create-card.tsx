"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { ErrorMessage, Input } from "@/components/ui/input"
import { Loading } from "@/components/ui/loading"
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover"
import { useFormValidation } from "@/hooks/use-form-validation"
import { cn } from "@/lib/utils"
import { NAME_CHARS_LIMIT, createCardSchema } from "@/lib/validations/card"
import { useRouter } from "@/navigation"
import { api } from "@/trpc/react"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import useMeasure from "react-use-measure"

export function CreateCard({
   listId,
   className,
   ...props
}: { listId: string } & ButtonProps) {
   const t = useTranslations("cards")
   const tCommon = useTranslations("common")
   const router = useRouter()
   const [isPending, startTransition] = useTransition()
   const [triggerRef, { width: triggerWidth }] = useMeasure()
   const [formData, setFormData] = useState({
      name: "",
      listId,
   })

   const { mutate: onSubmit, isLoading } = api.card.create.useMutation({
      onSuccess: () => {
         startTransition(() => {
            router.refresh()
         })
         setTimeout(() => {
            toast.success(t("create-success"))
            //close popover
            document.dispatchEvent(
               new KeyboardEvent("keydown", { key: "Escape" })
            )
         }, 300)
      },
      onError: () => {
         return toast.error(t("create-error"))
      },
   })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () => onSubmit(formData),
      formData,
      zodSchema: createCardSchema,
   })

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               ref={triggerRef}
               className={cn("w-full ", className)}
               variant="ghost"
               size={"sm"}
               {...props}
            >
               <Plus size={18} /> {t("new-card")}
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
                  className="h-9"
                  invalid={errors.name}
                  value={formData.name}
                  onChange={(e) =>
                     setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder={t("new-card-label")}
               />
               <ErrorMessage
                  error={{
                     message: errors.name,
                     dynamicParams: { limit: NAME_CHARS_LIMIT },
                  }}
               />
               <Button
                  size={"sm"}
                  disabled={isLoading || isPending}
                  className="mt-3 w-full"
               >
                  {isLoading || isPending ? <Loading /> : tCommon("create")}
               </Button>
            </form>
         </PopoverContent>
      </Popover>
   )
}
