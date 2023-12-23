"use client"

import {
   useEditor,
   EditorContent,
   type Editor as CoreEditor,
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { useTranslations } from "next-intl"
import { Toggle, toggleVariants } from "@/components/ui/toggle"
import {
   Bold,
   Heading1,
   Heading2,
   ImageIcon,
   Italic,
   List,
   ListOrdered,
   Redo,
   Strikethrough,
   Undo,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Hint } from "@/components/hint"
import {
   type ChangeEvent,
   type ClipboardEvent,
   useState,
   useEffect,
   useRef,
   type Dispatch,
   type SetStateAction,
} from "react"
import { FileButton } from "@/components/ui/file-button"
import { useUploadThing } from "@/lib/uploadthing"
import { toast } from "sonner"

type EditorProps<T extends boolean> = {
   value: string
   onChange: (value: string) => void
   className?: string
} & (T extends true
   ? {
        shouldSetImages: true
        setImages: Dispatch<SetStateAction<string[]>>
     }
   : {
        shouldSetImages?: false
        setImages?: Dispatch<SetStateAction<string[]>>
     })

export const Editor = <T extends boolean>({
   value,
   onChange,
   className,
   shouldSetImages = false,
   setImages,
}: EditorProps<T>) => {
   const t = useTranslations("editor")
   const [isAnyTooltipVisible, setIsAnyTooltipVisible] = useState(false)
   const [isMounted, setIsMounted] = useState(false)

   const editor = useEditor({
      extensions: [
         StarterKit,
         Link,
         Image.configure({
            HTMLAttributes: {
               class: "rounded-md",
            },
         }),
         Placeholder.configure({
            placeholder: t("placeholder"),
         }),
      ],
      content: value,
      editorProps: {
         attributes: {
            id: "editor",
            class: cn(
               "w-full prose rounded-lg px-3 py-2 focus:outline-none",
               className
            ),
         },
      },
      onUpdate({ editor: _editor }) {
         const editor = _editor as CoreEditor
         onChange(editor.getHTML() === "<p></p>" ? "" : editor.getHTML())
         checkForNodeDeletions({ editor })
      },
   })
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const previousState = useRef<any>()

   useEffect(() => {
      if (!isMounted && editor && shouldSetImages) {
         checkForNodeDeletions({ editor })
         setIsMounted(true)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [editor, isMounted])

   const checkForNodeDeletions = ({ editor }: { editor: CoreEditor }) => {
      if (!shouldSetImages) return
      // Compare previous/current nodes to detect deleted ones

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prevNodesById: Record<string, any> = {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      previousState.current?.doc.forEach((node: any) => {
         if (node.attrs.src) {
            //only images
            prevNodesById[node.attrs.src] = node
         }
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodesById: Record<string, any> = {}
      editor.state.doc.forEach((node) => {
         if (node.attrs.src) {
            //only images
            nodesById[node.attrs.src] = node
         }
      })

      previousState.current = editor.state
      for (const [id, node] of Object.entries(prevNodesById)) {
         const image = node.attrs.src
         if (nodesById[id] === undefined && node.type.name === "image") {
            setImages?.((prev) => prev.filter((src) => src !== image))
         } else {
            setImages?.((prev) =>
               prev.includes(image) ? prev : [...prev, image]
            )
         }
      }
   }

   const { startUpload, isUploading } = useUploadThing("imageUploader")

   if (!editor) return null

   async function onImageChange(e: ChangeEvent<HTMLInputElement>) {
      if (e.target.files?.[0]) {
         uploadImage(e.target.files[0])
      }
   }

   async function onImagePaste(e: ClipboardEvent<HTMLDivElement>) {
      if (isUploading) return

      if (e.clipboardData.files?.[0]) {
         uploadImage(e.clipboardData.files[0])
      }
   }

   function uploadImage(file: File) {
      const promise = () => startUpload([file])

      toast.promise(promise, {
         loading: t("uploading"),
         success: (uploadedImage) => {
            if (uploadedImage?.[0]?.url) {
               setImages?.((prev) => [...prev, uploadedImage[0]!.url])

               editor
                  ?.chain()
                  .focus()
                  .setImage({ src: uploadedImage[0].url })
                  .run()
            }
            return t("uploaded")
         },
         error: t("upload-error"),
      })
   }

   return (
      <div
         className="w-[98%] rounded-lg border border-input bg-background
      ring-ring ring-offset-2 ring-offset-white focus-within:outline-none focus-within:ring-2"
      >
         <div className="scroll-x flex overflow-x-auto border-b-2 border-dotted border-input p-1 pb-1.5">
            <Hint
               delayDuration={isAnyTooltipVisible ? 0 : 300}
               onMouseOver={() => setIsAnyTooltipVisible(true)}
               onMouseLeave={() => setIsAnyTooltipVisible(false)}
               className="px-0.5"
               content={t("1")}
            >
               <Toggle
                  size={"sm"}
                  aria-label={t("1")}
                  pressed={editor.isActive("heading", { level: 1 })}
                  onPressedChange={() =>
                     editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
               >
                  <Heading1 size={20} />
               </Toggle>
            </Hint>
            <Hint
               delayDuration={isAnyTooltipVisible ? 0 : 300}
               onMouseOver={() => setIsAnyTooltipVisible(true)}
               onMouseLeave={() => setIsAnyTooltipVisible(false)}
               content={t("2")}
               className="px-0.5"
            >
               <Toggle
                  size={"sm"}
                  aria-label={t("2")}
                  pressed={editor.isActive("heading", { level: 2 })}
                  onPressedChange={() =>
                     editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
               >
                  <Heading2 size={20} />
               </Toggle>
            </Hint>
            <Hint
               onMouseOver={() => setIsAnyTooltipVisible(true)}
               onMouseLeave={() => setIsAnyTooltipVisible(false)}
               className="px-0.5"
               delayDuration={isAnyTooltipVisible ? 0 : 300}
               content={t("3")}
            >
               <Toggle
                  onMouseOver={() => setIsAnyTooltipVisible(true)}
                  onMouseLeave={() => setIsAnyTooltipVisible(false)}
                  size={"sm"}
                  aria-label={t("3")}
                  pressed={editor.isActive("bold")}
                  onPressedChange={() =>
                     editor.chain().focus().toggleBold().run()
                  }
               >
                  <Bold size={20} />
               </Toggle>
            </Hint>
            <Hint
               onMouseOver={() => setIsAnyTooltipVisible(true)}
               onMouseLeave={() => setIsAnyTooltipVisible(false)}
               className="px-0.5"
               delayDuration={isAnyTooltipVisible ? 0 : 300}
               content={t("4")}
            >
               <Toggle
                  onMouseOver={() => setIsAnyTooltipVisible(true)}
                  onMouseLeave={() => setIsAnyTooltipVisible(false)}
                  size={"sm"}
                  aria-label={t("4")}
                  pressed={editor.isActive("italic")}
                  onPressedChange={() =>
                     editor.chain().focus().toggleItalic().run()
                  }
               >
                  <Italic size={20} />
               </Toggle>
            </Hint>
            <Hint
               onMouseOver={() => setIsAnyTooltipVisible(true)}
               onMouseLeave={() => setIsAnyTooltipVisible(false)}
               className="px-0.5"
               delayDuration={isAnyTooltipVisible ? 0 : 300}
               content={t("5")}
            >
               <Toggle
                  onMouseOver={() => setIsAnyTooltipVisible(true)}
                  onMouseLeave={() => setIsAnyTooltipVisible(false)}
                  size={"sm"}
                  aria-label={t("5")}
                  pressed={editor.isActive("strike")}
                  onPressedChange={() =>
                     editor.chain().focus().toggleStrike().run()
                  }
               >
                  <Strikethrough size={20} />
               </Toggle>
            </Hint>
            <Hint
               onMouseOver={() => setIsAnyTooltipVisible(true)}
               onMouseLeave={() => setIsAnyTooltipVisible(false)}
               className="px-0.5"
               delayDuration={isAnyTooltipVisible ? 0 : 300}
               content={t("6")}
            >
               <Toggle
                  onMouseOver={() => setIsAnyTooltipVisible(true)}
                  onMouseLeave={() => setIsAnyTooltipVisible(false)}
                  size={"sm"}
                  aria-label={t("6")}
                  pressed={editor.isActive("orderedList")}
                  onPressedChange={() =>
                     editor.chain().focus().toggleOrderedList().run()
                  }
               >
                  <ListOrdered size={20} />
               </Toggle>
            </Hint>
            <Hint
               onMouseOver={() => setIsAnyTooltipVisible(true)}
               onMouseLeave={() => setIsAnyTooltipVisible(false)}
               className="px-0.5"
               delayDuration={isAnyTooltipVisible ? 0 : 300}
               content={t("7")}
            >
               <Toggle
                  onMouseOver={() => setIsAnyTooltipVisible(true)}
                  onMouseLeave={() => setIsAnyTooltipVisible(false)}
                  size={"sm"}
                  aria-label={t("7")}
                  pressed={editor.isActive("bulletList")}
                  onPressedChange={() =>
                     editor.chain().focus().toggleBulletList().run()
                  }
               >
                  <List size={20} />
               </Toggle>
            </Hint>
            <Hint
               onMouseOver={() => setIsAnyTooltipVisible(true)}
               onMouseLeave={() => setIsAnyTooltipVisible(false)}
               className="px-0.5"
               delayDuration={isAnyTooltipVisible ? 0 : 300}
               content={t("8")}
            >
               <FileButton
                  onMouseOver={() => setIsAnyTooltipVisible(true)}
                  onMouseLeave={() => setIsAnyTooltipVisible(false)}
                  className={cn("text-foreground")}
                  aria-label={t("8")}
                  disabled={isUploading}
                  onChange={onImageChange}
                  accept="image/*"
               >
                  <ImageIcon size={20} />
               </FileButton>
            </Hint>
            <Hint
               onMouseOver={() => setIsAnyTooltipVisible(true)}
               onMouseLeave={() => setIsAnyTooltipVisible(false)}
               className="px-0.5"
               delayDuration={isAnyTooltipVisible ? 0 : 300}
               content={t("8")}
            >
               <Button
                  onMouseOver={() => setIsAnyTooltipVisible(true)}
                  onMouseLeave={() => setIsAnyTooltipVisible(false)}
                  className={cn(
                     toggleVariants({ size: "sm" }),
                     "text-foreground"
                  )}
                  aria-label={t("9")}
                  onClick={() => editor.chain().focus().undo().run()}
               >
                  <Undo size={20} />
               </Button>
            </Hint>
            <Hint
               onMouseOver={() => setIsAnyTooltipVisible(true)}
               onMouseLeave={() => setIsAnyTooltipVisible(false)}
               className="px-0.5"
               delayDuration={isAnyTooltipVisible ? 0 : 300}
               content={t("9")}
            >
               <Button
                  onMouseOver={() => setIsAnyTooltipVisible(true)}
                  onMouseLeave={() => setIsAnyTooltipVisible(false)}
                  className={cn(
                     toggleVariants({ size: "sm" }),
                     "text-foreground"
                  )}
                  aria-label={t("10")}
                  onClick={() => editor.chain().focus().redo().run()}
               >
                  <Redo size={20} />
               </Button>
            </Hint>
         </div>
         <EditorContent
            onPaste={onImagePaste}
            editor={editor}
         />
      </div>
   )
}
