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
import { NAME_CHARS_LIMIT, createBoardSchema } from "@/lib/validations/board"
import { useRouter } from "@/navigation"
import { api } from "@/trpc/react"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import useMeasure from "react-use-measure"

export function CreateBoard({
   organizationId,
   className,
   ...props
}: { organizationId: string } & ButtonProps) {
   const t = useTranslations("boards")
   const tCommon = useTranslations("common")
   const router = useRouter()
   const utils = api.useUtils()
   const [isPending, startTransition] = useTransition()
   const [triggerRef, { width: triggerWidth }] = useMeasure()
   const [formData, setFormData] = useState({
      name: "",
      organizationId,
   })

   const { mutate: onSubmit, isLoading } = api.board.create.useMutation({
      onSuccess: (createdBoardId) => {
         startTransition(() => {
            router.push(`/dashboard/board/${createdBoardId}`)
         })
         void utils.board.getAll.invalidate()
         setTimeout(() => {
            toast.success(t("create-success"))
         }, 500)
      },
      onError: () => {
         return toast.error(t("create-error"))
      },
   })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () => onSubmit(formData),
      formData,
      zodSchema: createBoardSchema,
   })

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               ref={triggerRef}
               className={cn("h-[120px] flex-col text-xl", className)}
               variant="secondary"
               {...props}
            >
               <Plus /> {t("new-board")}
            </Button>
         </PopoverTrigger>
         <PopoverContent style={{ minWidth: triggerWidth }}>
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
                  placeholder={t("new-board-label")}
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
