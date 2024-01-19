import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, getUploadthingFileIdsFromHTML } from "@/lib/utils"
import { api } from "@/trpc/react"
import { Draggable } from "@hello-pangea/dnd"
import { type List } from "@prisma/client"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { Dialog } from "@/components/ui/dialog"

import Image from "next/image"
import { useIsClient } from "@/hooks/use-is-client"
import dynamic from "next/dynamic"
import { useDeleteUploadthingFiles } from "@/hooks/use-delete-uploadthing-files"
import { type ExtendedCard } from "@/lib/validations/card"

const DetailsDialogContent = dynamic(
   () => import("@/components/dialogs/card-details-dialog-content"),
   {
      ssr: false,
   }
)
const EditDialog = dynamic(
   () => import("@/components/dialogs/card-edit-dialog"),
   {
      ssr: false,
   }
)

type CardProps = {
   card: ExtendedCard
   list: List
   index: number
   isDragLoading: boolean
}

export function Card({ card, index, list, isDragLoading }: CardProps) {
   const t = useTranslations("cards")
   const tCommon = useTranslations("common")
   const { isClient } = useIsClient()
   const utils = api.useUtils()

   const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
   const [editDialogOpen, setEditDialogOpen] = useState(false)
   const [menuOpen, setMenuOpen] = useState(false)

   const { mutate: onDelete } = api.card.delete.useMutation({
      onMutate: async () => {
         await utils.list.getAll.cancel()
         const previousLists = utils.list.getAll.getData({
            boardId: list.boardId,
         })

         utils.list.getAll.setData(
            { boardId: list.boardId },
            (oldQueryData) =>
               oldQueryData?.map((oldList) =>
                  oldList.id === list.id
                     ? {
                          ...oldList,
                          cards: oldList.cards.filter(
                             (oldCard) => oldCard.id !== card.id
                          ),
                       }
                     : oldList
               )
         )
         toast.success(t.rich("delete-success", { name: card.name }))

         return { previousLists }
      },
      onSuccess: ({ description }) => {
         const filesToDelete = getUploadthingFileIdsFromHTML(description)
         if (filesToDelete && filesToDelete.length > 0) {
            onDeleteFiles({
               fileIds: filesToDelete,
            })
         }
      },
      onError: (_err, _data, context) => {
         utils.list.getAll.setData(
            { boardId: list.boardId },
            context?.previousLists
         )
         toast.dismiss()
         return toast.error(t("delete-error"))
      },
      onSettled: () => {
         void utils.list.getAll.invalidate()
      },
   })

   const { onDeleteFiles } = useDeleteUploadthingFiles()

   function getLastImageSrcFromHTML(html: string | null) {
      if (!html || !isClient) return

      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      // Get all img elements in the document
      const images = doc.querySelectorAll("img")

      // Get the last image element and its source URL
      const lastImg = images[images.length - 1]
      const imgSrc = lastImg ? lastImg.getAttribute("src") : null

      return imgSrc
   }

   const lastImageSrc = getLastImageSrcFromHTML(card.description)

   return (
      <>
         <Draggable
            isDragDisabled={isDragLoading}
            draggableId={card.id}
            index={index}
         >
            {(provided) => (
               <Dialog
                  open={detailsDialogOpen}
                  onOpenChange={setDetailsDialogOpen}
               >
                  <li
                     id={card.id}
                     role="button"
                     onClick={() => setDetailsDialogOpen(true)}
                     className={cn(
                        "group mt-2 w-full !cursor-pointer rounded-lg bg-border/30 text-start backdrop-blur-sm transition-opacity hover:opacity-80",
                        !lastImageSrc ? "border" : ""
                     )}
                     ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                  >
                     {lastImageSrc && (
                        <Image
                           className="max-h-[150px] rounded-lg rounded-b-none object-cover"
                           width={288}
                           height={150}
                           src={lastImageSrc}
                           alt={card.name}
                        />
                     )}
                     <div
                        className={cn(
                           "flex items-center gap-1 rounded-lg p-2",
                           lastImageSrc
                              ? "rounded-t-none border border-t-0"
                              : ""
                        )}
                     >
                        <h3 className="ml-0.5">{card.name}</h3>
                        <DropdownMenu
                           open={menuOpen}
                           onOpenChange={setMenuOpen}
                        >
                           <DropdownMenuTrigger asChild>
                              <Button
                                 disabled={card.id === "optimistic"}
                                 onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                 }}
                                 variant={"ghost"}
                                 size={"icon"}
                                 className={cn(
                                    "ml-auto h-7 w-7 flex-shrink-0 self-start hover:bg-primary/10 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100",
                                    !menuOpen ? "opacity-0" : ""
                                 )}
                              >
                                 <MoreHorizontal
                                    size={20}
                                    className="pointer-events-none"
                                 />
                                 <span className="sr-only">
                                    Show more options
                                 </span>
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                 onClick={(e) => e.stopPropagation()}
                                 onSelect={() => setEditDialogOpen(true)}
                              >
                                 <Pencil
                                    className="mr-1"
                                    size={20}
                                 />
                                 {tCommon("edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 onClick={(e) => e.stopPropagation()}
                                 onSelect={(e) => {
                                    e.preventDefault()
                                    onDelete({ cardId: card.id })
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
                  </li>
                  <DetailsDialogContent
                     listName={list.name}
                     card={card}
                     open={detailsDialogOpen}
                  />
               </Dialog>
            )}
         </Draggable>
         <EditDialog
            card={card}
            open={editDialogOpen}
            setOpen={setEditDialogOpen}
         />
      </>
   )
}
