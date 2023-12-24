import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loading } from "@/components/ui/loading"
import { useFormValidation } from "@/hooks/use-form-validation"
import { cn, focusContentEditableElement } from "@/lib/utils"
import { NAME_CHARS_LIMIT, updateCardSchema } from "@/lib/validations/card"
import { useRouter } from "@/navigation"
import { api } from "@/trpc/react"
import { Draggable } from "@hello-pangea/dnd"
import { type List, type Card } from "@prisma/client"
import {
   AlignLeft,
   AppWindow,
   GanttChart,
   MessageCircle,
   MoreHorizontal,
   Pencil,
   Trash2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { type KeyboardEvent, startTransition, useState } from "react"
import { toast } from "sonner"
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { ErrorMessage, Input } from "@/components/ui/input"
import { Editor } from "@/components/ui/editor"
import { flushSync } from "react-dom"
import Image from "next/image"

type CardProps = {
   card: Card
   list: List
   index: number
   isDragLoading: boolean
}

export function Card({ card, index, list, isDragLoading }: CardProps) {
   const t = useTranslations("cards")
   const tCommon = useTranslations("common")
   const router = useRouter()
   const [isEditing, setIsEditing] = useState(false)

   const [editDialogOpen, setEditDialogOpen] = useState(false)
   const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
   const [menuOpen, setMenuOpen] = useState(false)

   const [images, setImages] = useState(card.images)

   const [formData, setFormData] = useState({
      name: card.name,
      cardId: card.id,
      description: card.description ?? "",
      images,
   })

   const { mutate: onDelete, isLoading } = api.card.delete.useMutation({
      onSuccess: (deletedBoardName) => {
         router.refresh()
         toast.success(t.rich("delete-success", { name: deletedBoardName }))
      },
      onError: () => {
         return toast.error(t("delete-error"))
      },
   })

   const { mutate: onUpdate, isLoading: isUpdateLoading } =
      api.card.update.useMutation({
         onSuccess: (updatedBoardName) => {
            startTransition(() => {
               router.refresh()
               setEditDialogOpen(false)
               setMenuOpen(false)
               setIsEditing(false)
               toast.success(
                  t.rich("update-success", { name: updatedBoardName })
               )
            })
         },
         onError: () => {
            return toast.error(t("update-error"))
         },
      })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () => onUpdate({ ...formData, images }),
      formData,
      zodSchema: updateCardSchema,
   })

   function onCancelEditing() {
      setIsEditing(false)
      setFormData((prev) => ({
         ...prev,
         description: card.description ?? "",
      }))
      setImages(card.images)
   }

   function onStartEditing() {
      flushSync(() => setIsEditing(true))
      focusContentEditableElement(document.getElementById("editor"))
   }

   function onEditorEscape(e: KeyboardEvent<HTMLDivElement>) {
      if (e.key === "Escape") onCancelEditing()
   }

   const hasImages = card.images.length > 0

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
                     onClick={() => {
                        setDetailsDialogOpen(true)
                     }}
                     className={cn(
                        "group mt-2 w-full !cursor-pointer rounded-lg bg-muted/25 text-start backdrop-blur-sm transition-opacity hover:opacity-80",
                        !hasImages ? "border" : ""
                     )}
                     ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                  >
                     {hasImages && (
                        <Image
                           className="max-h-[150px] rounded-lg rounded-b-none object-cover"
                           width={288}
                           height={150}
                           src={card.images?.[card.images.length - 1] ?? ""}
                           alt={card.name}
                        />
                     )}
                     <div
                        className={cn(
                           "flex items-center gap-1 rounded-lg p-2",
                           hasImages ? "rounded-t-none border border-t-0" : ""
                        )}
                     >
                        <h3 className="ml-0.5">{card.name}</h3>
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
                                 className={cn(
                                    "ml-auto h-7 w-7 flex-shrink-0 self-start hover:bg-primary/10 group-hover:visible group-focus:visible",
                                    !menuOpen ? "invisible" : ""
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
                                 onClick={(e) => {
                                    e.stopPropagation()
                                 }}
                                 onSelect={() => {
                                    setEditDialogOpen(true)
                                 }}
                              >
                                 <Pencil
                                    className="mr-1"
                                    size={20}
                                 />
                                 {tCommon("edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 disabled={isLoading}
                                 onClick={(e) => {
                                    e.stopPropagation()
                                 }}
                                 onSelect={(e) => {
                                    e.preventDefault()
                                    onDelete({ cardId: card.id })
                                 }}
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
                  </li>

                  <DialogContent className="max-w-xl">
                     <DialogHeader className="px-1">
                        <DialogTitle className="font-medium">
                           <AppWindow className="-mt-0.5 mr-1 inline " />{" "}
                           {card.name}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground">
                           {t("in-list")}{" "}
                           <strong className="font-semibold">
                              {list.name}
                           </strong>
                        </p>
                     </DialogHeader>
                     <div className="max-h-[80vh] overflow-y-auto px-1">
                        <section>
                           <DialogTitle className="mt-8 flex items-center gap-2 font-medium">
                              <AlignLeft className="inline" />{" "}
                              {t("description")}
                              {!isEditing &&
                                 formData.description.length > 0 && (
                                    <Button
                                       className="ml-auto"
                                       aria-label={tCommon("edit")}
                                       size={"icon"}
                                       variant={"outline"}
                                       onClick={onStartEditing}
                                    >
                                       <Pencil size={20} />
                                    </Button>
                                 )}
                           </DialogTitle>
                           <div className="mt-4">
                              {isEditing ? (
                                 <>
                                    <Editor
                                       shouldSetImages
                                       setImages={setImages}
                                       className="min-h-[150px]"
                                       value={formData.description}
                                       onKeyDown={onEditorEscape}
                                       onChange={(description) =>
                                          setFormData((prev) => ({
                                             ...prev,
                                             description,
                                          }))
                                       }
                                    />
                                    <div className="mt-3 flex gap-2">
                                       <Button
                                          disabled={isUpdateLoading}
                                          size={"sm"}
                                          onClick={() => {
                                             onUpdate({ ...formData, images })
                                          }}
                                       >
                                          {tCommon("save")}
                                          {isUpdateLoading && <Loading />}
                                       </Button>
                                       <Button
                                          size={"sm"}
                                          onClick={onCancelEditing}
                                          variant={"outline"}
                                       >
                                          {tCommon("cancel")}
                                       </Button>
                                    </div>
                                 </>
                              ) : card.description ? (
                                 <div
                                    className="prose"
                                    dangerouslySetInnerHTML={{
                                       __html: card.description,
                                    }}
                                 />
                              ) : (
                                 <Button
                                    onClick={onStartEditing}
                                    variant={"secondary"}
                                 >
                                    {t("add-description")}
                                 </Button>
                              )}
                           </div>
                        </section>
                        <section className="mt-8">
                           <DialogTitle className="font-medium">
                              <MessageCircle className="-mt-0.5 mr-1 inline " />{" "}
                              {t("comments")}
                           </DialogTitle>
                           <Button
                              className="mt-4"
                              variant={"secondary"}
                           >
                              {t("add-description")}
                           </Button>
                        </section>
                        <section>
                           <DialogTitle className="mt-8 font-medium">
                              <GanttChart className="-mt-0.5 mr-1 inline " />{" "}
                              {t("activity")}
                           </DialogTitle>
                        </section>
                     </div>
                  </DialogContent>
               </Dialog>
            )}
         </Draggable>
         <Dialog
            open={editDialogOpen}
            onOpenChange={(open) => {
               if (!open) {
                  setFormData((prev) => ({
                     ...prev,
                     name: card.name,
                  }))
                  setEditDialogOpen(false)
               } else {
                  setEditDialogOpen(true)
               }
            }}
         >
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>
                     {tCommon("edit")} {tCommon("card")}
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
                     placeholder={t("new-card-label")}
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
      </>
   )
}
