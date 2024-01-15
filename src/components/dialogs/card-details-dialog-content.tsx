import { DateDisplay } from "@/components/date-display"
import { Button } from "@/components/ui/button"
import {
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { Editor, EditorOutput } from "@/components/ui/editor"
import { flushSync } from "react-dom"
import { Loading } from "@/components/ui/loading"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/ui/user-avatar"
import {
   cn,
   focusContentEditableElement,
   getUploadthingFileIdsFromHTML,
} from "@/lib/utils"
import { api } from "@/trpc/react"
import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { type KeyboardEvent, useState } from "react"
import {
   AppWindow,
   AlignLeft,
   Pencil,
   MessageCircle,
   MoreHorizontal,
   Trash2,
   GanttChart,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { type Card } from "@prisma/client"
import { useUser } from "@clerk/nextjs"
import { actionLookup, entityTypeLookup } from "@/config"
import { useDeleteUploadthingFiles } from "@/hooks/use-delete-uploadthing-files"
import { useUpdateCard } from "@/hooks/use-update-card"

type CardDialogProps = {
   card: Card
   open: boolean
   listName: string
}

export default function CardDetailsDialogContent({
   card,
   open,
   listName,
}: CardDialogProps) {
   const t = useTranslations("cards")
   const tCommon = useTranslations("common")
   const { user } = useUser()

   const [isEditingDescription, setIsEditingDescription] = useState(false)
   const [isCreatingComment, setIsCreatingComment] = useState(false)
   const [comment, setComment] = useState("")
   const [fileIdsToDeleteFromStorage, setFileIdsToDeleteFromStorage] = useState<
      string[]
   >([])

   const utils = api.useUtils()

   const {
      data: comments,
      isError: isCommentsError,
      isLoading: isCommentsLoading,
   } = api.card.getComments.useQuery({ cardId: card.id }, { enabled: open })

   const {
      data: auditLogs,
      isError: isAuditLogsError,
      isLoading: isAuditLogsLoading,
   } = api.card.getAuditLogs.useQuery({ cardId: card.id }, { enabled: open })

   const { onDeleteFiles } = useDeleteUploadthingFiles()

   const { isUpdateLoading, formData, onUpdate, setFormData } = useUpdateCard({
      card,
      onSuccess: () => {
         setIsEditingDescription(false)
         if (fileIdsToDeleteFromStorage.length > 0) {
            onDeleteFiles({
               fileIds: fileIdsToDeleteFromStorage,
            })
         }
      },
   })

   const { mutate: onCreateComment, isLoading: isCreateCommentLoading } =
      api.card.createComment.useMutation({
         onSuccess: async () => {
            if (fileIdsToDeleteFromStorage.length > 0) {
               onDeleteFiles({
                  fileIds: fileIdsToDeleteFromStorage,
               })
            }
            await utils.card.getAuditLogs.invalidate()
            await utils.card.getComments.invalidate()
            toast.success(t("create-comment-success"))
            setIsCreatingComment(false)
            setComment("")
         },
         onError: () => {
            return toast.error(t("create-comment-error"))
         },
      })

   const { mutate: onDeleteComment, isLoading: isDeleteCommentLoading } =
      api.card.deleteComment.useMutation({
         onSuccess: ({ content }) => {
            toast.success(t.rich("delete-comment-success"))
            const filesToDelete = getUploadthingFileIdsFromHTML(content)
            if (filesToDelete && filesToDelete.length > 0) {
               onDeleteFiles({
                  fileIds: filesToDelete,
               })
            }
         },
         onError: () => {
            return toast.error(t("delete-comment-error"))
         },
         onSettled: () => {
            void utils.card.getAuditLogs.invalidate()
            void utils.card.getComments.invalidate()
         },
      })

   function onStartDescriptionEditing() {
      flushSync(() => setIsEditingDescription(true))
      focusContentEditableElement(document.getElementById("editor"))
   }

   function onEditorEscape(e: KeyboardEvent<HTMLDivElement>) {
      if (e.key === "Escape") {
         onCancelDescriptionEditing()
         setIsCreatingComment(false)
      }
   }

   function onCancelDescriptionEditing() {
      setIsEditingDescription(false)
      setFormData((prev) => ({
         ...prev,
         description: card.description ?? "",
      }))
   }

   return (
      <DialogContent
         className="min-h-[90svh] max-w-xl md:min-h-[612px]"
         onAnimationEndCapture={() => {
            toast.dismiss()
         }}
      >
         <DialogHeader>
            <DialogTitle className="font-medium">
               <AppWindow className="-mt-0.5 mr-1 inline " /> {card.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
               {t("in-list")}{" "}
               <strong className="font-semibold">{listName}</strong>
            </p>
         </DialogHeader>

         <section>
            <DialogTitle className="mt-10 flex items-center gap-2 font-medium">
               <AlignLeft className="inline" /> {t("description")}
               {!isEditingDescription && formData.description.length > 0 && (
                  <Button
                     className="ml-auto"
                     aria-label={tCommon("edit")}
                     size={"icon"}
                     variant={"outline"}
                     onClick={onStartDescriptionEditing}
                  >
                     <Pencil size={20} />
                  </Button>
               )}
            </DialogTitle>
            <div className="mt-6">
               {isEditingDescription ? (
                  <>
                     <Editor
                        setFileIdsToDeleteFromStorage={
                           setFileIdsToDeleteFromStorage
                        }
                        className="min-h-[150px]"
                        value={formData.description}
                        onKeyDown={onEditorEscape}
                        onChange={(description) =>
                           setFormData((prev) => ({ ...prev, description }))
                        }
                     />
                     <div className="mt-3 flex gap-2">
                        <Button
                           disabled={isUpdateLoading}
                           size={"sm"}
                           onClick={() => onUpdate(formData)}
                        >
                           {tCommon("save")}
                           {isUpdateLoading && <Loading />}
                        </Button>
                        <Button
                           size={"sm"}
                           onClick={onCancelDescriptionEditing}
                           variant={"outline"}
                        >
                           {tCommon("cancel")}
                        </Button>
                     </div>
                  </>
               ) : formData.description ? (
                  <EditorOutput html={formData.description} />
               ) : (
                  <Button
                     onClick={onStartDescriptionEditing}
                     variant={"secondary"}
                  >
                     {t("add-description")}
                  </Button>
               )}
            </div>
         </section>

         <section className="mt-10">
            <DialogTitle className="font-medium">
               <MessageCircle className="-mt-0.5 mr-1 inline " />{" "}
               {t("comments")}
            </DialogTitle>

            <div
               className={cn(
                  "mt-6 flex gap-3",
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
                        disabled={comment.length < 1 || isCreateCommentLoading}
                        className="mt-4"
                        onClick={() =>
                           onCreateComment({
                              content: comment,
                              cardId: card.id,
                           })
                        }
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
                           email: user?.emailAddresses[0]?.emailAddress,
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
            <div className="mt-5 w-full [--avatar-size:32px]">
               {isCommentsLoading ? (
                  <div className="mt-5 flex w-full gap-3">
                     <Skeleton className="size-[var(--avatar-size)] flex-shrink-0 rounded-full" />
                     <div className="w-full">
                        <div className="flex items-end gap-2">
                           <Skeleton className="h-3 w-28" />
                           <Skeleton className="mb-[1px] h-2 w-20" />
                        </div>
                        <Skeleton className="mt-3 h-3 w-[80%]" />
                        <Skeleton className="mt-2 h-3 w-[70%]" />
                     </div>
                  </div>
               ) : isCommentsError ? (
                  <p className="font-medium text-destructive">
                     {t("get-comments-error")}
                  </p>
               ) : (
                  comments?.map((c) => (
                     <div
                        key={c.id}
                        className="group mt-4 flex gap-3"
                     >
                        <UserAvatar
                           className="mt-1.5"
                           user={c.author}
                        />
                        <div className="w-full">
                           <p className="text-sm font-medium">
                              {c.author.firstName} {c.author.lastName}{" "}
                              <DateDisplay
                                 justNowText={tCommon("just-now")}
                                 className="text-xs font-normal text-muted-foreground"
                              >
                                 {c.createdAt}
                              </DateDisplay>
                           </p>
                           <EditorOutput html={c.content ?? ""} />
                        </div>
                        {c.authorId === user?.id && (
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button
                                    onClick={(e) => {
                                       e.preventDefault()
                                    }}
                                    variant={"ghost"}
                                    size={"icon"}
                                    className={cn(
                                       "ml-auto h-7 w-7 flex-shrink-0 self-start hover:bg-primary/10 data-[state=open]:opacity-100 md:opacity-0 md:focus:opacity-100 md:group-hover:opacity-100"
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
                                    disabled={isDeleteCommentLoading}
                                    onClick={(e) => {
                                       e.stopPropagation()
                                    }}
                                    onSelect={(e) => {
                                       e.preventDefault()
                                       onDeleteComment({
                                          commentId: c.id,
                                       })
                                    }}
                                    className="!text-destructive"
                                 >
                                    {isDeleteCommentLoading ? (
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
                        )}
                     </div>
                  ))
               )}
            </div>
         </section>

         <section className="mt-10">
            <DialogTitle className="font-medium">
               <GanttChart className="-mt-0.5 mr-1 inline " /> {t("activity")}
            </DialogTitle>

            <div className="mt-5 w-full [--avatar-size:32px]">
               {isAuditLogsLoading ? (
                  <>
                     {[...new Array(2)].map((_, idx) => (
                        <div
                           key={idx}
                           className="mt-5 flex w-full gap-3"
                        >
                           <Skeleton className="size-[var(--avatar-size)] flex-shrink-0 rounded-full" />
                           <div className="w-full">
                              <Skeleton className="h-3 w-[60%]" />
                              <Skeleton className="mt-3 h-2 w-[40%]" />
                           </div>
                        </div>
                     ))}
                  </>
               ) : isAuditLogsError ? (
                  <p className="font-medium text-destructive">
                     {t("get-audit-logs-error")}
                  </p>
               ) : (
                  auditLogs?.map((log) => (
                     <div
                        className="mt-3 flex items-start gap-2"
                        key={log.id}
                     >
                        <UserAvatar
                           className="mt-0.5"
                           user={log.user}
                        />
                        <div>
                           <p className="text-sm leading-none text-foreground/75">
                              <strong className="font-medium">
                                 {log.user.firstName} {log.user.lastName}
                              </strong>{" "}
                              {tCommon(actionLookup[log.action])}{" "}
                              {tCommon("this")}{" "}
                              {tCommon(entityTypeLookup[log.entityType])}{" "}
                              {log.action === "MOVE" && (
                                 <>
                                    {tCommon("from")}{" "}
                                    <strong className="font-medium">
                                       "{log.sourceEntityName}"
                                    </strong>{" "}
                                    {tCommon("to")}{" "}
                                    <strong className="font-medium">
                                       "{log.destinationEntityName}"
                                    </strong>
                                 </>
                              )}
                           </p>
                           <DateDisplay
                              className="text-xs font-normal text-muted-foreground"
                              justNowText={tCommon("just-now")}
                           >
                              {log.createdAt}
                           </DateDisplay>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </section>
      </DialogContent>
   )
}
