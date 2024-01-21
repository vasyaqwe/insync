"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/navigation"
import { type Board as BoardType } from "@prisma/client"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarPlus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useFormatter, useTranslations } from "next-intl"
import { api } from "@/trpc/react"
import { toast } from "sonner"
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
import { getUploadthingFileIdsFromHTML } from "@/lib/utils"

type BoardProps = {
   board: BoardType
}

export function Board({ board }: BoardProps) {
   const t = useTranslations("boards")
   const tCommon = useTranslations("common")
   const format = useFormatter()
   const utils = api.useUtils()
   const [dialogOpen, setDialogOpen] = useState(false)
   const [formData, setFormData] = useState({
      name: board.name,
      boardId: board.id,
   })

   function onMutateError(previousBoards: BoardType[] = []) {
      utils.board.getAll.setData(
         { organizationId: board.organizationId },
         previousBoards
      )
      toast.dismiss()
   }
   async function onMutation() {
      await utils.board.getAll.cancel()
      const previousBoards = utils.board.getAll.getData({
         organizationId: board.organizationId,
      })

      return { previousBoards }
   }

   const { mutate: onDeleteFiles } = api.uploadthing.deleteFiles.useMutation()

   const { mutate: onDelete } = api.board.delete.useMutation({
      onMutate: async () => {
         const { previousBoards } = await onMutation()

         utils.board.getAll.setData(
            { organizationId: board.organizationId },
            (oldQueryData) =>
               oldQueryData?.filter((oldBoard) => oldBoard.id !== board.id)
         )
         toast.success(t.rich("delete-success", { name: board.name }))

         return { previousBoards }
      },
      onSuccess: ({ editorContents }) => {
         const filesToDelete = editorContents.flatMap((d) =>
            getUploadthingFileIdsFromHTML(d)
         )

         if (filesToDelete && filesToDelete.length > 0) {
            onDeleteFiles({
               fileIds: filesToDelete,
            })
         }
      },
      onError: (_err, _data, context) => {
         onMutateError(context?.previousBoards)
         return toast.error(t("delete-error"))
      },
      onSettled: () => {
         void utils.board.getAll.invalidate()
      },
   })

   const { mutate: onUpdate } = api.board.update.useMutation({
      onMutate: async ({ name, boardId }) => {
         const { previousBoards } = await onMutation()

         utils.board.getAll.setData(
            { organizationId: board.organizationId },
            (oldQueryData) =>
               oldQueryData?.map((oldBoard) =>
                  oldBoard.id === boardId ? { ...oldBoard, name } : oldBoard
               )
         )
         toast.success(t.rich("update-success", { name: board.name }))
         setDialogOpen(false)

         return { previousBoards }
      },
      onError: (_err, _data, context) => {
         onMutateError(context?.previousBoards)
         setDialogOpen(true)
         return toast.error(t("update-error"))
      },
      onSettled: () => {
         void utils.board.getAll.invalidate()
      },
   })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () => onUpdate(formData),
      formData,
      zodSchema: updateBoardSchema,
   })

   return (
      <>
         <Button
            className="group block h-[120px] p-0 active:py-0"
            variant={"outline"}
            asChild
         >
            <Link href={`/dashboard/board/${board.id}`}>
               <div className="p-4 group-active:pb-[15px] group-active:pt-[17px]">
                  <h3
                     title={board.name}
                     className="truncate text-xl font-medium"
                  >
                     {board.name}
                  </h3>
               </div>
               <div className="flex items-center justify-between border-t-2 border-dotted px-4 py-2 group-active:pb-[7px] group-active:pt-[9px]">
                  <p className="text-sm text-foreground/75">
                     <CalendarPlus
                        className="mr-1 inline align-sub"
                        size={18}
                     />
                     {t("created")}{" "}
                     <span suppressHydrationWarning>
                        {format.dateTime(board.createdAt, {
                           month: "short",
                           day: "numeric",
                        })}
                     </span>
                  </p>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                           }}
                           variant={"ghost"}
                           size={"icon"}
                           className="hover:bg-primary/10"
                        >
                           <MoreHorizontal className="pointer-events-none" />
                           <span className="sr-only">Show more options</span>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent
                        onClick={(e) => {
                           e.stopPropagation()
                        }}
                        align="end"
                     >
                        <DropdownMenuItem
                           onSelect={() => {
                              setDialogOpen(true)
                           }}
                        >
                           <Pencil
                              className="mr-1"
                              size={20}
                           />
                           {tCommon("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           onSelect={(e) => {
                              e.preventDefault()
                              onDelete({ boardId: board.id })
                           }}
                           className="!text-destructive"
                        >
                           <Trash2
                              className="mr-1"
                              size={20}
                           />
                           {tCommon("delete")}
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </Link>
         </Button>
         <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
               if (!open) {
                  setFormData((prev) => ({ ...prev, name: board.name }))
                  setDialogOpen(false)
               } else {
                  setDialogOpen(true)
               }
            }}
         >
            <DialogContent className="max-w-sm">
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
                     className="mt-3 w-full"
                  >
                     {tCommon("update")}
                  </Button>
               </form>
            </DialogContent>
         </Dialog>
      </>
   )
}
