"use client"

import { Button } from "@/components/ui/button"
import { Card as UICard } from "@/components/ui/card"
import { useRouter } from "@/navigation"
import {
   type Board,
   type Card as CardType,
   type List as ListType,
} from "@prisma/client"
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
import { type FocusEvent, useRef, useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { flushSync } from "react-dom"
import { CreateCard } from "@/components/forms/create-card"
import {
   DragDropContext,
   type DropResult,
   Droppable,
   Draggable,
} from "@hello-pangea/dnd"
import { Card } from "@/components/card"

type ExtendedList = ListType & { cards: CardType[] }

type ListProps = {
   list: ExtendedList
   index: number
   isLoading: boolean
}

function List({ list, index, isLoading: isDragLoading }: ListProps) {
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
      <Draggable
         draggableId={list.id}
         index={index}
         isDragDisabled={isDragLoading}
      >
         {(provided) => (
            <UICard
               asChild
               className={cn("relative ml-4 w-[18rem] flex-shrink-0 p-3")}
            >
               <li
                  ref={provided.innerRef}
                  {...provided.draggableProps}
               >
                  <div
                     {...provided.dragHandleProps}
                     className="flex items-start justify-between"
                  >
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
                           "mt-0.5 w-full cursor-pointer break-all px-1 text-lg font-medium",
                           isEditing ? "hidden" : ""
                        )}
                     >
                        {formData.name}
                     </h2>
                     <Textarea
                        onKeyDown={(e) => {
                           if (e.key === "Escape" || e.key === "Enter")
                              textareaRef.current?.blur()
                        }}
                        ref={textareaRef}
                        onBlur={onTextareaBlur}
                        className={cn(
                           "mt-0.5 w-full resize-none rounded-[.35rem] border-none px-1 py-0 text-lg font-medium",
                           !isEditing ? "hidden" : ""
                        )}
                        value={formData.name}
                        onChange={(e) =>
                           setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                           }))
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
                              className="ml-3 flex-shrink-0"
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
                  <Droppable
                     droppableId={list.id}
                     type="card"
                  >
                     {(provided) => (
                        <ol
                           {...provided.droppableProps}
                           ref={provided.innerRef}
                           className={cn("min-h-[1px]")}
                        >
                           {list.cards.map((card, cardIndex) => (
                              <Card
                                 key={card.id}
                                 list={list}
                                 card={card}
                                 index={cardIndex}
                                 isDragLoading={isDragLoading}
                              />
                           ))}
                           {provided.placeholder}
                        </ol>
                     )}
                  </Droppable>
                  <CreateCard
                     className="mt-2"
                     listId={list.id}
                  />
               </li>
            </UICard>
         )}
      </Draggable>
   )
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
   const result = Array.from(list)
   const [removed] = result.splice(startIndex, 1)

   if (removed) {
      result.splice(endIndex, 0, removed)
   }

   return result
}

export function ListsWrapper({
   board,
}: {
   board: Pick<Board, "id" | "name"> & { lists: ExtendedList[] }
}) {
   const t = useTranslations("lists")
   const tCards = useTranslations("cards")
   const [orderedData, setOrderedData] = useState(board.lists)

   const router = useRouter()

   useEffect(() => {
      setOrderedData(board.lists)
   }, [board.lists])

   const { mutate: onUpdateListOrder, isLoading: isUpdateListOrderLoading } =
      api.list.updateOrder.useMutation({
         onSuccess: () => {
            router.refresh()
         },
         onError: () => {
            t("update-error")
         },
      })

   const { mutate: onUpdateCardOrder, isLoading: isUpdateCardOrderLoading } =
      api.card.updateOrder.useMutation({
         onSuccess: () => {
            router.refresh()
         },
         onError: () => {
            tCards("update-error")
         },
      })

   function onDragEnd({ destination, source, type }: DropResult) {
      if (!destination) return

      //dropped in the same place
      if (
         destination.droppableId === source.droppableId &&
         destination.index === source.index
      )
         return

      if (type === "list") {
         const items = reorder(
            orderedData,
            source.index,
            destination.index
         ).map((item, index) => ({ ...item, order: index }))

         setOrderedData(items)
         onUpdateListOrder({ items })
      }

      // User moves a card
      if (type === "card") {
         const newOrderedData = [...orderedData]

         const sourceList = newOrderedData.find(
            (list) => list.id === source.droppableId
         )
         const destList = newOrderedData.find(
            (list) => list.id === destination.droppableId
         )

         if (!sourceList || !destList) {
            return
         }

         // Check if cards exists on the sourceList
         if (!sourceList.cards) {
            sourceList.cards = []
         }

         // Check if cards exists on the destList
         if (!destList.cards) {
            destList.cards = []
         }

         // Moving the card in the same list
         if (source.droppableId === destination.droppableId) {
            const reorderedCards = reorder(
               sourceList.cards,
               source.index,
               destination.index
            )
            reorderedCards.forEach((card, idx) => {
               card.order = idx
            })

            sourceList.cards = reorderedCards

            setOrderedData(newOrderedData)
            onUpdateCardOrder({ items: reorderedCards })
         } else {
            // User moves the card to another list

            // Remove card from the source list
            const [movedCard] = sourceList.cards.splice(source.index, 1)

            if (!movedCard) return

            // Assign the new listId to the moved card
            movedCard.listId = destination.droppableId

            // Add card to the destination list
            destList.cards.splice(destination.index, 0, movedCard)

            sourceList.cards.forEach((card, idx) => {
               card.order = idx
            })

            // Update the order for each card in the destination list
            destList.cards.forEach((card, idx) => {
               card.order = idx
            })

            setOrderedData(newOrderedData)
            onUpdateCardOrder({ items: destList.cards })
         }
      }
   }

   return (
      <DragDropContext onDragEnd={onDragEnd}>
         <Droppable
            droppableId="lists"
            type="list"
            direction="horizontal"
         >
            {(provided) => (
               <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn("-ml-4 mt-6 flex items-start")}
               >
                  {orderedData.map((list, index) => (
                     <List
                        key={list.id}
                        isLoading={
                           isUpdateCardOrderLoading || isUpdateListOrderLoading
                        }
                        index={index}
                        list={list}
                     />
                  ))}
                  {provided.placeholder}
               </ol>
            )}
         </Droppable>
      </DragDropContext>
   )
}
