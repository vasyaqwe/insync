"use client"

import { Button } from "@/components/ui/button"
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import { ErrorMessage, Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loading } from "@/components/ui/loading"
import { useFormValidation } from "@/hooks/use-form-validation"
import { useOrganizationList } from "@clerk/nextjs"
import { useMutation } from "@tanstack/react-query"
import { Check, PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import {
   Command,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command"
import { api } from "@/trpc/react"
import { useDebounce } from "@/hooks/use-debounce"
import { UserAvatar } from "@/components/ui/user-avatar"
import { type User } from "@clerk/nextjs/server"
import { cn, isEmail } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

type UserItemUser = Pick<User, "id"> & {
   email: string
} & Partial<Pick<User, "firstName" | "lastName" | "imageUrl">>

const NAME_CHARS_LIMIT = 32
const GUEST_USER_ID = "guestId"

const createOrganizationSchema = z.object({
   name: z
      .string()
      .min(1, { message: "required" })
      .max(NAME_CHARS_LIMIT, { message: "maxLimit" }),
})

export function CreateOrganizationDialog() {
   const t = useTranslations("create-community")
   const [open, setOpen] = useState(false)
   const [query, setQuery] = useState("")
   const [isQueryFullEmail, setIsQueryFullEmail] = useState(true)
   const [selectedUsers, setSelectedUsers] = useState<UserItemUser[]>([])
   const debouncedInput = useDebounce<string>({
      value: query,
      delay: 400,
   })

   const { createOrganization } = useOrganizationList()

   const [formData, setFormData] = useState({
      name: "",
   })

   const {
      refetch,
      isFetching,
      data: searchResults,
   } = api.user.search.useQuery(
      { query },
      { enabled: false, keepPreviousData: query.length > 0 }
   )

   useEffect(() => {
      if (debouncedInput.length > 0) {
         void refetch()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [debouncedInput])

   function onChange(e: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
   }

   const { mutate: onSubmit, isLoading } = useMutation({
      mutationFn: async () => {
         if (createOrganization) {
            await createOrganization({ name: formData.name })
         }
      },
      onSuccess: () => {
         setOpen(false)
         setFormData({ name: "" })
         setSelectedUsers([])
         setQuery("")
         toast.success(t("success"))
      },
      onError: () => {
         return toast.error(t("error"))
      },
   })

   const { safeOnSubmit, errors } = useFormValidation({
      onSubmit: () => onSubmit(),
      formData,
      zodSchema: createOrganizationSchema,
   })

   function onUserSelect(user: UserItemUser) {
      if (isEmail(user.email)) {
         setIsQueryFullEmail(true)
         if (selectedUsers.some((u) => u.email === user.email)) {
            setSelectedUsers((prev) =>
               prev.filter((prevUser) => prevUser.email !== user.email)
            )
         } else if (typeof user !== "string") {
            setSelectedUsers((prev) => [...prev, user])
            if (user.id === GUEST_USER_ID) setQuery("")
         }
      } else if (user.id === GUEST_USER_ID) {
         setIsQueryFullEmail(false)
      }
   }

   const filteredSelectedUsers =
      query.length > 0
         ? selectedUsers?.filter(
              (u) =>
                 !searchResults?.some(
                    (user) => user.emailAddresses[0]?.emailAddress === u.email
                 ) && u.email !== query
           )
         : selectedUsers

   const totalItems = [...filteredSelectedUsers, ...(searchResults ?? [])]

   return (
      <Dialog
         open={open}
         onOpenChange={setOpen}
      >
         <DialogTrigger asChild>
            <Button
               aria-label={t("title")}
               size={"icon"}
               variant={"ghost"}
            >
               <PlusIcon />
            </Button>
         </DialogTrigger>
         <DialogContent className="items-center">
            <DialogHeader>
               <DialogTitle className="text-2xl font-semibold">
                  {t("title")}
               </DialogTitle>
            </DialogHeader>
            <form
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
                  placeholder={t("namePlaceholder")}
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

               <Command
                  filter={(value, search) => {
                     if (
                        value.includes(search) ||
                        selectedUsers.some((u) => u.email.includes(value))
                     )
                        return 1
                     return 0
                  }}
                  className="h-[355px] rounded-sm border shadow-sm"
               >
                  <CommandInput
                     value={query}
                     onValueChange={(val) => setQuery(val)}
                     name="invite"
                     id="invite"
                     placeholder="name@example.com"
                  />
                  {query.length < 1 && selectedUsers.length < 1 && (
                     <p className="p-2 text-sm text-muted-foreground">
                        Search results will appear here.
                     </p>
                  )}
                  {
                     <CommandList>
                        <CommandGroup>
                           {query.length > 0 && (
                              <UserItem
                                 user={{
                                    id: GUEST_USER_ID,
                                    email: query,
                                 }}
                                 isQueryFullEmail={isQueryFullEmail}
                                 onSelect={onUserSelect}
                                 selectedUsers={selectedUsers}
                              />
                           )}
                           {!isFetching &&
                              searchResults?.map((user) => (
                                 <UserItem
                                    key={user.emailAddresses[0]?.emailAddress}
                                    user={{
                                       id: user.id,
                                       firstName: user.firstName ?? "",
                                       lastName: user.lastName ?? "",
                                       imageUrl: user.imageUrl,
                                       email:
                                          user.emailAddresses[0]
                                             ?.emailAddress ?? "",
                                    }}
                                    onSelect={onUserSelect}
                                    selectedUsers={selectedUsers}
                                 />
                              ))}

                           {[...filteredSelectedUsers].reverse().map((user) => (
                              <UserItem
                                 key={user.email}
                                 user={user}
                                 onSelect={onUserSelect}
                                 selectedUsers={selectedUsers}
                              />
                           ))}

                           {/* subtract the amount of items currently visible in the list */}
                           {isFetching &&
                              4 - totalItems.length > -1 &&
                              Array(4 - totalItems.length)
                                 .fill("")
                                 .map((_item, idx) => (
                                    <UserItemSkeleton key={idx} />
                                 ))}
                        </CommandGroup>
                     </CommandList>
                  }
               </Command>

               <div className="mt-5 flex items-center justify-between">
                  {selectedUsers.length < 1 ? (
                     <p className="text-sm text-foreground/75">
                        Selected users will appear here.
                     </p>
                  ) : (
                     <div className="flex items-center pl-3">
                        {selectedUsers.map((user, idx) => (
                           <UserAvatar
                              className="-ml-3"
                              user={{
                                 ...user,
                                 emailAddresses: [{ emailAddress: user.email }],
                              }}
                              key={idx}
                           />
                        ))}
                     </div>
                  )}
                  <Button disabled={isLoading}>
                     {isLoading ? <Loading /> : t("create")}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   )
}

function UserItem({
   user,
   selectedUsers,
   onSelect,
   isQueryFullEmail = true,
}: {
   user: UserItemUser
   selectedUsers: UserItemUser[]
   onSelect: (user: UserItemUser) => void
   isQueryFullEmail?: boolean
}) {
   const t = useTranslations("create-community")
   return (
      <CommandItem
         className="flex items-center gap-2"
         value={user.email}
         onSelect={() => onSelect(user)}
      >
         <UserAvatar
            user={{
               imageUrl: user.imageUrl,
               firstName: user.firstName,
               emailAddresses: [{ emailAddress: user.email }],
            }}
         />
         <div className="w-full">
            <p className="truncate">
               {user.firstName} {user.lastName}{" "}
            </p>
            <p className="flex w-full items-center text-foreground/75">
               <span className="line-clamp-1 break-all">{user.email}</span>
               <span
                  className={cn(
                     "ml-auto whitespace-nowrap text-xs font-medium text-primary",
                     isEmail(user.email)
                        ? "hidden"
                        : isQueryFullEmail
                        ? "invisible"
                        : ""
                  )}
               >
                  {t("email-hint")}
               </span>
            </p>
         </div>

         <span
            className={cn(
               "ml-auto grid h-6 w-6 flex-shrink-0 place-content-center rounded-full bg-primary",
               !isQueryFullEmail
                  ? "hidden"
                  : !selectedUsers.some((u) => u.email === user.email) &&
                    isQueryFullEmail
                  ? "invisible"
                  : ""
            )}
         >
            <Check
               size={16}
               className="stroke-background"
            />
         </span>
      </CommandItem>
   )
}

function UserItemSkeleton({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) {
   return (
      <div
         className={cn("flex items-center gap-3 px-2 py-1.5", className)}
         {...props}
      >
         <Skeleton className="h-[var(--avatar-size)] w-[var(--avatar-size)] flex-shrink-0 rounded-full" />
         <div className="w-full">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="mt-3 h-3 w-[70%]" />
         </div>
      </div>
   )
}
