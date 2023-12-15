"use client"

import { DateDisplay } from "@/components/date"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link, useRouter } from "@/navigation"
import { type Board } from "@prisma/client"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarPlus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import { Loading } from "@/components/ui/loading"
import { ErrorMessage, Input } from "@/components/ui/input"
import { useState } from "react"
import { NAME_CHARS_LIMIT, updateBoardSchema } from "@/lib/validations/board"
import { useFormValidation } from "@/hooks/use-form-validation"
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"

type BoardProps = {
   board: Board
}
export function Board({ board }: BoardProps) {
   const t = useTranslations("boards")
   const tCommon = useTranslations("common")
   const router = useRouter()
   const [dialogOpen, setDialogOpen] = useState(false)
   const [menuOpen, setMenuOpen] = useState(false)
   const [formData, setFormData] = useState({
      name: board.name,
      boardId: board.id,
   })

   const { mutate: onDelete, isLoading } = api.board.delete.useMutation({
      onSuccess: (deletedBoardName) => {
         router.refresh()
         toast.success(t.rich("delete-success", { name: deletedBoardName }))
      },
      onError: () => {
         return toast.error(t("delete-error"))
      },
   })

   const { mutate: onUpdate, isLoading: isUpdateLoading } =
      api.board.update.useMutation({
         onSuccess: (updatedBoardName) => {
            router.refresh()
            toast.success(t.rich("update-success", { name: updatedBoardName }))
            setDialogOpen(false)
            setMenuOpen(false)
         },
         onError: () => {
            return toast.error(t("update-error"))
         },
      })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () => onUpdate(formData),
      formData,
      zodSchema: updateBoardSchema,
   })

   return (
      <Card
         className="h-[120px] p-0 transition hover:opacity-80"
         asChild
      >
         <Link href={`/dashboard/board/${board.id}`}>
            <div className="p-4">
               <h3 className="truncate text-xl font-medium">{board.name}</h3>
            </div>
            <div
               onClick={(e) => {
                  e.stopPropagation()
               }}
               className="flex items-center justify-between border-t-2 border-dotted px-4 py-2"
            >
               <p className="text-sm text-foreground/75">
                  <CalendarPlus
                     className="mr-1 inline align-sub "
                     size={18}
                  />
                  {t("created")} <DateDisplay date={board.createdAt} />
               </p>
               <DropdownMenu
                  open={menuOpen}
                  onOpenChange={setMenuOpen}
               >
                  <DropdownMenuTrigger asChild>
                     <Button
                        onClick={(e) => {
                           e.preventDefault()
                           e.stopPropagation()
                        }}
                        variant={"ghost"}
                        size={"icon"}
                     >
                        <MoreHorizontal className="pointer-events-none" />
                        <span className="sr-only">Show more options</span>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem
                        onSelect={(e) => {
                           e.preventDefault()
                           onDelete({ boardId: board.id })
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
                     <DropdownMenuItem
                        onSelect={(e) => {
                           e.preventDefault()
                           setDialogOpen(true)
                        }}
                     >
                        <Pencil
                           className="mr-1"
                           size={20}
                        />
                        {tCommon("edit")}
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
               <Dialog
                  open={dialogOpen}
                  onOpenChange={(open) => {
                     if (!open) {
                        setFormData((prev) => ({ ...prev, name: board.name }))
                        setMenuOpen(false)
                        setDialogOpen(false)
                     } else {
                        setDialogOpen(true)
                        setMenuOpen(true)
                     }
                  }}
               >
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>
                           {tCommon("edit")} {board.name}
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
                           placeholder={t("new-board-label")}
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
            </div>
         </Link>
      </Card>
   )
}
