"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "@/navigation"
import { type Card as CardType, type List } from "@prisma/client"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import { Loading } from "@/components/ui/loading"
import { type FocusEvent, useRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { flushSync } from "react-dom"
import { CreateCard } from "@/components/forms/create-card"

type ListProps = {
   list: List & { cards: CardType[] }
}
export function List({ list }: ListProps) {
   const t = useTranslations("lists")
   const tCommon = useTranslations("common")
   const router = useRouter()

   const [menuOpen, setMenuOpen] = useState(false)
   const [isEditing, setIsEditing] = useState(false)
   const [formData, setFormData] = useState({
      name: list.name,
      listId: list.id,
   })
   const [previousFormData, setPreviousFormData] = useState(formData)

   const textareaRef = useRef<HTMLTextAreaElement>(null)

   const { mutate: onDelete, isLoading } = api.list.delete.useMutation({
      onSuccess: (deletedListName) => {
         router.refresh()
         toast.success(t.rich("delete-success", { name: deletedListName }))
      },
      onError: () => {
         return toast.error(t("delete-error"))
      },
   })
   const { mutate: onUpdate } = api.list.update.useMutation({
      onSuccess: () => {
         router.refresh()
         setMenuOpen(false)
      },
      onError: () => {
         return toast.error(t("update-error"))
      },
   })

   function onTextareaBlur(e: FocusEvent<HTMLTextAreaElement>) {
      setIsEditing(false)
      if (formData.name.length < 1) {
         setFormData(previousFormData)
         return e.preventDefault()
      }

      if (previousFormData.name !== formData.name) {
         onUpdate(formData)
         setPreviousFormData(formData)
      }
   }

   return (
      <Card className="relative p-3">
         <div className="flex items-start justify-between">
            <h2
               onClick={() => {
                  flushSync(() => {
                     setIsEditing(true)
                  })
                  textareaRef.current?.focus()
                  textareaRef.current?.select()
               }}
               role="textbox"
               className={cn(
                  "mr-4 mt-0.5 w-full cursor-pointer break-all px-2 text-lg font-medium",
                  isEditing ? "hidden" : ""
               )}
            >
               {formData.name}
            </h2>
            <Textarea
               onKeyDown={(e) => {
                  if (e.key === "Escape") textareaRef.current?.blur()
               }}
               ref={textareaRef}
               onBlur={onTextareaBlur}
               className={cn(
                  "mr-4 mt-0.5 resize-none rounded-[.35rem] border-none px-2 py-0 text-lg font-medium",
                  !isEditing ? "hidden" : ""
               )}
               value={formData.name}
               onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
               }
            />

            <DropdownMenu
               open={menuOpen}
               onOpenChange={setMenuOpen}
            >
               <DropdownMenuTrigger asChild>
                  <Button
                     variant={"ghost"}
                     size={"icon"}
                     className="flex-shrink-0"
                  >
                     <MoreHorizontal className="pointer-events-none" />
                     <span className="sr-only">Show more options</span>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuItem
                     onSelect={(e) => {
                        e.preventDefault()
                        onDelete({ listId: list.id })
                     }}
                     disabled={isLoading}
                     className="!text-destructive"
                  >
                     {isLoading ? (
                        <Loading className="mx-auto" />
                     ) : (
                        <>
                           <Trash2
                              className="mr-1"
                              size={20}
                           />
                           {tCommon("delete")}
                        </>
                     )}
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
         <div className="mt-2 flex flex-col gap-2">
            {list.cards.map((card) => (
               <div key={card.id}>
                  <Card className="bg-muted/25 px-3 py-2">
                     <h3>{card.name}</h3>
                  </Card>
               </div>
            ))}
            <CreateCard listId={list.id} />
         </div>
      </Card>
   )
}
