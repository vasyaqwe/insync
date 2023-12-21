import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loading } from "@/components/ui/loading"
import { useFormValidation } from "@/hooks/use-form-validation"
import { cn } from "@/lib/utils"
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
import { useState } from "react"
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

   const [formData, setFormData] = useState({
      name: card.name,
      cardId: card.id,
   })
   const [description, setDescription] = useState("")

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
            router.refresh()
            toast.success(t.rich("update-success", { name: updatedBoardName }))
            setEditDialogOpen(false)
            setMenuOpen(false)
         },
         onError: () => {
            return toast.error(t("update-error"))
         },
      })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () => onUpdate(formData),
      formData,
      zodSchema: updateCardSchema,
   })

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
                     className="group mt-2 flex w-full !cursor-pointer items-center gap-1 overflow-hidden rounded-lg border bg-muted/25 px-2 py-2 text-start backdrop-blur-sm"
                     ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
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
                                 "ml-auto h-7 w-7 self-start hover:bg-secondary/75 group-hover:visible",
                                 !menuOpen ? "invisible" : ""
                              )}
                           >
                              <MoreHorizontal
                                 size={20}
                                 className="pointer-events-none"
                              />
                              <span className="sr-only">Show more options</span>
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
                  </li>

                  <DialogContent className="max-w-xl">
                     <DialogHeader>
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
                     <section>
                        <DialogTitle className="mt-8 font-medium">
                           <AlignLeft className="-mt-0.5 mr-1 inline " />{" "}
                           {t("description")}
                        </DialogTitle>
                        <div className="mt-4">
                           {isEditing ? (
                              <>
                                 <Editor
                                    className="min-h-[150px]"
                                    value={description}
                                    onChange={(value) => setDescription(value)}
                                 />
                                 <div className="mt-3 flex gap-2">
                                    <Button
                                       size={"sm"}
                                       onClick={() => setIsEditing(false)}
                                    >
                                       {tCommon("save")}
                                    </Button>
                                    <Button
                                       size={"sm"}
                                       onClick={() => setIsEditing(false)}
                                       variant={"outline"}
                                    >
                                       {tCommon("cancel")}
                                    </Button>
                                 </div>
                              </>
                           ) : (
                              <Button
                                 onClick={() => {
                                    flushSync(() => setIsEditing(true))
                                    document.getElementById("editor")?.focus()
                                 }}
                                 variant={"secondary"}
                              >
                                 {t("add-description")}
                              </Button>
                           )}
                        </div>
                     </section>
                     <section>
                        <DialogTitle className="mt-8 font-medium">
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
