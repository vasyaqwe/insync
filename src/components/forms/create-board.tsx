"use client"

import { Button } from "@/components/ui/button"
import { ErrorMessage, Input } from "@/components/ui/input"
import { Loading } from "@/components/ui/loading"
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover"
import { useFormValidation } from "@/hooks/use-form-validation"
import { NAME_CHARS_LIMIT, createBoardSchema } from "@/lib/validations/board"
import { useRouter } from "@/navigation"
import { api } from "@/trpc/react"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

export function CreateBoard({ organizationId }: { organizationId: string }) {
   const t = useTranslations("boards")
   const tCommon = useTranslations("common")
   const router = useRouter()

   const [formData, setFormData] = useState({
      name: "",
   })

   const { mutate: onSubmit, isLoading } = api.board.create.useMutation({
      onSuccess: (createdBoardId) => {
         router.push(`/dashboard/${createdBoardId}`)
         router.refresh()
         toast.success(t("create-success"))
      },
      onError: () => {
         return toast.error(t("create-error"))
      },
   })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () =>
         onSubmit({
            name: formData.name,
            organizationId,
         }),
      formData,
      zodSchema: createBoardSchema,
   })

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button variant="secondary">
               <Plus /> {t("new-board")}
            </Button>
         </PopoverTrigger>
         <PopoverContent asChild>
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
                  disabled={isLoading}
                  className="mt-3 w-full"
               >
                  {tCommon("create")}
                  {isLoading && <Loading />}
               </Button>
            </form>
         </PopoverContent>
      </Popover>
   )
}
