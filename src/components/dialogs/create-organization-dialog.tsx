"use client"

import { Button } from "@/components/ui/button"
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { ErrorMessage, Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loading } from "@/components/ui/loading"
import { useFormValidation } from "@/hooks/use-form-validation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { api } from "@/trpc/react"
import { UserAvatar } from "@/components/ui/user-avatar"
import {
   type CommandItemUser,
   NAME_CHARS_LIMIT,
   createOrganizationSchema,
} from "@/lib/validations/organization"
import { useRouter } from "@/navigation"
import { useGlobalStore } from "@/stores/use-global-store"
import { InviteCommand } from "@/components/invite-command"
import { useShallow } from "zustand/react/shallow"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"

export default function CreateOrganizationDialog() {
   const t = useTranslations("create-organization")
   const router = useRouter()
   const { setLastVisitedOrganizationId, setExpandedOrganizations } =
      useOrganizationHelpersStore()

   const { open, closeDialog, openDialog } = useGlobalStore(
      useShallow((state) => ({
         closeDialog: state.closeDialog,
         openDialog: state.openDialog,
         open: state.dialogs.createOrganization,
      }))
   )

   const [selectedUsers, setSelectedUsers] = useState<CommandItemUser[]>([])

   const [formData, setFormData] = useState({
      name: "",
   })

   function onChange(e: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
   }

   const { mutate: onSubmit, isPending } = api.organization.create.useMutation({
      onSuccess: (createdOrgId) => {
         closeDialog("createOrganization")
         setFormData({ name: "" })
         setSelectedUsers([])
         // setQuery("")
         setLastVisitedOrganizationId(createdOrgId)
         setExpandedOrganizations(createdOrgId)
         router.push(`/dashboard/${createdOrgId}`)
         router.refresh()
         toast.success(t("success"))
      },
      onError: () => {
         return toast.error(t("error"))
      },
   })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () =>
         onSubmit({
            name: formData.name,
            invitedUsers: selectedUsers,
         }),
      formData,
      zodSchema: createOrganizationSchema,
   })

   return (
      <Dialog
         open={open}
         onOpenChange={(open) => {
            if (!open) {
               closeDialog("createOrganization")
            } else {
               openDialog("createOrganization")
            }
         }}
      >
         <DialogContent className="max-md:min-h-[90svh]">
            <DialogHeader>
               <DialogTitle>{t("title")}</DialogTitle>
            </DialogHeader>
            <form
               className="flex w-full flex-grow flex-col"
               onSubmit={(e) => {
                  e.preventDefault()
                  safeOnSubmit()
               }}
            >
               <Label
                  className="mt-8 inline-block"
                  htmlFor="name"
               >
                  {t("name")}
               </Label>
               <Input
                  placeholder={t("name-placeholder")}
                  invalid={errors.name}
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={onChange}
               />
               <ErrorMessage
                  error={{
                     message: errors.name,
                     dynamicParams: { limit: NAME_CHARS_LIMIT },
                  }}
               />

               <Label
                  className="mt-5 inline-block"
                  htmlFor="invite"
               >
                  {t("invite")}
               </Label>

               <InviteCommand
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
               />

               <div className="mt-5 flex min-h-[var(--avatar-size)] items-center justify-between gap-3">
                  {selectedUsers.length < 1 ? (
                     <p className="text-sm text-muted-foreground">
                        {t("selected-users-empty")}
                     </p>
                  ) : (
                     <div className="flex items-center pl-3">
                        {selectedUsers.map((user) => (
                           <UserAvatar
                              className="-ml-3"
                              user={user}
                              key={user.email}
                           />
                        ))}
                     </div>
                  )}
                  <Button disabled={isPending}>
                     {t("create")}
                     {isPending && <Loading />}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   )
}
