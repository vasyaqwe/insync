import { Button } from "@/components/ui/button"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { ErrorMessage, Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loading } from "@/components/ui/loading"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useFormValidation } from "@/hooks/use-form-validation"
import { useUploadThing } from "@/lib/uploadthing"
import { NAME_CHARS_LIMIT, updateUserSchema } from "@/lib/validations/user"
import { useRouter } from "@/navigation"
import { useGlobalStore } from "@/stores/use-global-store"
import { api } from "@/trpc/react"
import { useUser } from "@clerk/nextjs"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useShallow } from "zustand/react/shallow"

export function UserSettingsDialog() {
   const t = useTranslations("user-settings")
   const tCommon = useTranslations("common")
   const { user, isLoaded } = useUser()
   const router = useRouter()

   const [formData, setFormData] = useState({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      imageUrl: user?.imageUrl,
   })

   useEffect(() => {
      if (isLoaded && user)
         setFormData({
            firstName: user.firstName!,
            lastName: user.lastName!,
            imageUrl: user.imageUrl,
         })
   }, [isLoaded, user])

   const { open, closeDialog, openDialog } = useGlobalStore(
      useShallow((state) => ({
         closeDialog: state.closeDialog,
         openDialog: state.openDialog,
         open: state.dialogs.userSettings,
      }))
   )

   const { mutate: onUpdate, isLoading } = api.user.update.useMutation({
      onSuccess: () => {
         void user?.reload()
         toast.success(t("update-success"))
         // TODO: use pusher to refresh router on user update
         setTimeout(() => {
            router.refresh()
         }, 2000)
      },
      onError: () => {
         return toast.error(t("update-error"))
      },
   })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () => onUpdate(formData),
      formData,
      zodSchema: updateUserSchema,
   })

   function onChange(e: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
   }

   const { startUpload, isUploading } = useUploadThing("imageUploader")

   async function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (e.target.files?.[0]) {
         const uploadedImage = await startUpload([e.target.files[0]])

         if (uploadedImage) {
            setFormData((prev) => ({
               ...prev,
               imageUrl: uploadedImage[0]?.url,
            }))
         }
      }
   }

   return (
      <Dialog
         onOpenChange={(open) => {
            if (!open) {
               closeDialog("userSettings")
            } else {
               openDialog("userSettings")
            }
         }}
         open={open}
      >
         <DialogContent
            onAnimationEndCapture={() => {
               if (user) {
                  setFormData({
                     firstName: user.firstName!,
                     lastName: user.lastName!,
                     imageUrl: user.imageUrl,
                  })
               }
            }}
            className="sm:max-w-[425px]"
         >
            <DialogHeader>
               <DialogTitle className="text-2xl font-semibold">
                  {t("title")}
               </DialogTitle>
               <DialogDescription className="mt-3 text-sm text-foreground/70">
                  {t("description")}
               </DialogDescription>
            </DialogHeader>
            <form
               onSubmit={(e) => {
                  e.preventDefault()
                  safeOnSubmit()
               }}
            >
               <Label
                  className="mt-5"
                  htmlFor="firstName"
               >
                  {t("first-name")}
               </Label>
               <Input
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={onChange}
               />
               <ErrorMessage
                  error={{
                     message: errors.firstName,
                     dynamicParams: { limit: NAME_CHARS_LIMIT },
                  }}
               />

               <Label
                  className="mt-5"
                  htmlFor="firstName"
               >
                  {t("last-name")}
               </Label>
               <Input
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={onChange}
               />
               <ErrorMessage
                  error={{
                     message: errors.lastName,
                     dynamicParams: { limit: NAME_CHARS_LIMIT },
                  }}
               />

               <Label
                  className="mt-5"
                  htmlFor="image"
               >
                  Image
               </Label>
               <div className="mt-2 flex items-center gap-4">
                  <label
                     htmlFor="image"
                     className="relative"
                  >
                     {isUploading && (
                        <div className="absolute inset-0 z-10 grid place-content-center rounded-full bg-popover/75">
                           <Loading />
                        </div>
                     )}
                     {formData.imageUrl ? (
                        <div className="relative h-[var(--avatar-size)] w-[var(--avatar-size)] flex-shrink-0">
                           <Image
                              className="rounded-full object-cover object-top"
                              src={formData.imageUrl}
                              alt={formData.firstName}
                              fill
                           />
                        </div>
                     ) : (
                        <UserAvatar
                           showActiveIndicator={false}
                           user={{
                              email: user?.emailAddresses[0]?.emailAddress,
                              imageUrl: formData.imageUrl,
                           }}
                        />
                     )}
                  </label>
                  <Input
                     id={"image"}
                     disabled={isUploading}
                     type="file"
                     onChange={onImageChange}
                  />
               </div>

               <Button
                  className="mt-9 w-full"
                  disabled={isLoading}
               >
                  {isLoading ? <Loading /> : tCommon("save")}
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   )
}
