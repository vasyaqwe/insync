import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loading } from "@/components/ui/loading"
import { useFormValidation } from "@/hooks/use-form-validation"
import {
   cn,
   focusContentEditableElement,
   getUploadthingFileIdsFromHTML,
} from "@/lib/utils"
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
import { useFormatter, useTranslations } from "next-intl"
import { type KeyboardEvent, startTransition, useState } from "react"
import { toast } from "sonner"
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { ErrorMessage, Input } from "@/components/ui/input"
import { Editor, EditorOutput } from "@/components/ui/editor"
import { flushSync } from "react-dom"
import Image from "next/image"
import { useIsClient } from "@/hooks/use-is-client"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useUser } from "@clerk/nextjs"

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
   const format = useFormatter()
   const { user } = useUser()
   const { isClient } = useIsClient()
   const [isEditing, setIsEditing] = useState(false)
   const [isCreatingComment, setIsCreatingComment] = useState(false)
   const [comment, setComment] = useState("")

   const [editDialogOpen, setEditDialogOpen] = useState(false)
   const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
   const [menuOpen, setMenuOpen] = useState(false)

   const [fileIdsToDeleteFromStorage, setFileIdsToDeleteFromStorage] = useState<
      string[]
   >([])

   const [formData, setFormData] = useState({
      name: card.name,
      cardId: card.id,
      description: card.description ?? "",
   })

   const {
      data: comments,
      isError: isCommentsError,
      isLoading: isCommentsLoading,
   } = api.card.getComments.useQuery({ cardId: card.id })

   const { mutate: onDelete, isLoading } = api.card.delete.useMutation({
      onSuccess: ({ name, description }) => {
         router.refresh()
         toast.success(t.rich("delete-success", { name }))
         const filesToDelete = getUploadthingFileIdsFromHTML(description)
         if (filesToDelete && filesToDelete.length > 0) {
            onDeleteFiles({
               fileIds: filesToDelete,
            })
         }
      },
      onError: () => {
         return toast.error(t("delete-error"))
      },
   })

   const { mutate: onDeleteFiles } = api.uploadthing.deleteFiles.useMutation({
      onSettled: () => {
         setFileIdsToDeleteFromStorage([])
      },
   })

   const { mutate: onUpdate, isLoading: isUpdateLoading } =
      api.card.update.useMutation({
         onSuccess: ({ name }) => {
            startTransition(() => {
               router.refresh()
               setEditDialogOpen(false)
               setMenuOpen(false)
               setIsEditing(false)
               toast.success(t.rich("update-success", { name }))
            })
            if (fileIdsToDeleteFromStorage.length > 0) {
               onDeleteFiles({
                  fileIds: fileIdsToDeleteFromStorage,
               })
            }
         },
         onError: () => {
            return toast.error(t("update-error"))
         },
      })

   const { mutate: onCreateComment, isLoading: isCreateCommentLoading } =
      api.card.createComment.useMutation({
         onSuccess: () => {
            startTransition(() => {
               setIsCreatingComment(false)
               toast.success(t("create-comment-success"))
            })
            if (fileIdsToDeleteFromStorage.length > 0) {
               onDeleteFiles({
                  fileIds: fileIdsToDeleteFromStorage,
               })
            }
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

   function onCancelEditing() {
      setIsEditing(false)
      setFormData((prev) => ({
         ...prev,
         description: card.description ?? "",
      }))
   }

   function onStartEditing() {
      flushSync(() => setIsEditing(true))
      focusContentEditableElement(document.getElementById("editor"))
   }

   function onEditorEscape(e: KeyboardEvent<HTMLDivElement>) {
      if (e.key === "Escape") {
         onCancelEditing()
         setIsCreatingComment(false)
      }
   }

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
                     onClick={() => {
                        setDetailsDialogOpen(true)
                     }}
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
                                 disabled={isLoading}
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
                        <DialogTitle className="mt-8 flex items-center gap-2 font-medium">
                           <AlignLeft className="inline" /> {t("description")}
                           {!isEditing && formData.description.length > 0 && (
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
                                    setFileIdsToDeleteFromStorage={
                                       setFileIdsToDeleteFromStorage
                                    }
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
                                          onUpdate({
                                             ...formData,
                                          })
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
                              <EditorOutput html={card.description} />
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

                        <div
                           className={cn(
                              "mt-4 flex gap-3",
                              isCreatingComment ? "items-start" : "items-center"
                           )}
                        >
                           {isCreatingComment ? (
                              <div className="w-full">
                                 <Editor
                                    setFileIdsToDeleteFromStorage={
                                       setFileIdsToDeleteFromStorage
                                    }
                                    className="min-h-[90px]"
                                    value={comment}
                                    onKeyDown={onEditorEscape}
                                    onChange={(comment) => setComment(comment)}
                                 />
                                 <Button
                                    disabled={
                                       comment.length < 1 ||
                                       isCreateCommentLoading
                                    }
                                    className="mt-4"
                                    onClick={() => {
                                       onCreateComment({
                                          content: comment,
                                          cardId: card.id,
                                       })
                                    }}
                                 >
                                    {tCommon("create")}
                                    {isCreateCommentLoading && <Loading />}
                                 </Button>
                              </div>
                           ) : (
                              <>
                                 <UserAvatar
                                    className="[--avatar-size:32px]"
                                    user={{
                                       email: user?.emailAddresses[0]
                                          ?.emailAddress,
                                       firstName: user?.firstName ?? undefined,
                                       imageUrl: user?.imageUrl,
                                    }}
                                 />
                                 <Button
                                    onClick={() => setIsCreatingComment(true)}
                                    variant={"secondary"}
                                 >
                                    {t("add-comment")}
                                 </Button>
                              </>
                           )}
                        </div>
                        {isCommentsLoading ? (
                           ""
                        ) : isCommentsError ? (
                           <p className="mt-4 font-medium text-destructive">
                              {t("get-comments-error")}
                           </p>
                        ) : (
                           <>
                              {comments.map((c) => (
                                 <div
                                    key={c.id}
                                    className="mt-4 flex gap-3"
                                 >
                                    <UserAvatar
                                       className="[--avatar-size:32px]"
                                       user={c.author}
                                    />
                                    <div>
                                       <p className="text-sm font-medium">
                                          {c.author.firstName}{" "}
                                          {c.author.lastName}{" "}
                                          <span
                                             className="text-xs font-normal text-muted-foreground"
                                             suppressHydrationWarning
                                          >
                                             {format.relativeTime(c.createdAt)}
                                          </span>
                                       </p>
                                       <EditorOutput html={c.content ?? ""} />
                                    </div>
                                 </div>
                              ))}
                           </>
                        )}
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
