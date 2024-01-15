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
import { NAME_CHARS_LIMIT, createListSchema } from "@/lib/validations/list"
import { useRouter } from "@/navigation"
import { api } from "@/trpc/react"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import useMeasure from "react-use-measure"

export function CreateList({
   boardId,
   className,
   ...props
}: { boardId: string } & ButtonProps) {
   const t = useTranslations("lists")
   const tCommon = useTranslations("common")
   const [isPending, startTransition] = useTransition()
   const router = useRouter()
   const [triggerRef, { width: triggerWidth }] = useMeasure()
   const [formData, setFormData] = useState({
      name: "",
      boardId,
   })

   const { mutate: onSubmit, isLoading } = api.list.create.useMutation({
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
               <Button
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
