import { Skeleton } from "@/components/ui/skeleton"
import { Check } from "lucide-react"
import {
   Command,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command"
import {
   type Dispatch,
   type SetStateAction,
   useEffect,
   useState,
   type HTMLAttributes,
} from "react"
import {
   GUEST_USER_ID,
   type CommandItemUser,
} from "@/lib/validations/organization"
import { cn, isEmail } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { api } from "@/trpc/react"
import { useUser } from "@clerk/nextjs"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useTranslations } from "next-intl"

type InviteCommandProps = {
   existingUserEmails?: string[]
   selectedUsers: CommandItemUser[]
   setSelectedUsers: Dispatch<SetStateAction<CommandItemUser[]>>
} & HTMLAttributes<HTMLDivElement>

export function InviteCommand({
   existingUserEmails = [],
   selectedUsers,
   setSelectedUsers,
   className,
   ...props
}: InviteCommandProps) {
   const t = useTranslations("invite-command")
   const { user: currentUser } = useUser()
   const [query, setQuery] = useState("")
   const [isEmailHintVisible, setIsEmailHintVisible] = useState(false)
   const [emailHint, setEmailHint] = useState(t("email-hint"))

   const debouncedInput = useDebounce<string>({
      value: query,
      delay: 400,
   })

   const { refetch, isFetching, data } = api.user.search.useQuery(
      { query },
      { enabled: false, keepPreviousData: query.length > 0 }
   )

   const searchResults =
      data
         ?.filter(
            (u) => u.email !== currentUser?.emailAddresses[0]?.emailAddress
         )
         ?.filter((u) => !existingUserEmails?.includes(u.email)) ?? []

   useEffect(() => {
      if (debouncedInput.length > 0) {
         void refetch()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [debouncedInput])

   function onUserSelect(selectedUser: CommandItemUser) {
      if (isEmail(selectedUser?.email ?? "")) {
         setIsEmailHintVisible(false)

         if (
            selectedUser.email === currentUser?.emailAddresses[0]?.emailAddress
         ) {
            setIsEmailHintVisible(true)
            return setEmailHint(t("email-error"))
         }

         if (existingUserEmails?.includes(selectedUser.email)) {
            setIsEmailHintVisible(true)
            return setEmailHint(t("email-exists-error"))
         }

         if (selectedUsers.some((u) => u.email === selectedUser.email)) {
            setSelectedUsers((prev) =>
               prev.filter((prevUser) => prevUser.email !== selectedUser.email)
            )
         } else {
            setSelectedUsers((prev) => [...prev, selectedUser])

            if (selectedUser.id === GUEST_USER_ID) setQuery("")
         }
      } else if (selectedUser.id === GUEST_USER_ID) {
         setIsEmailHintVisible(true)
         setEmailHint(t("email-hint"))
      }
   }

   const filteredSelectedUsers =
      query.length > 0
         ? selectedUsers?.filter(
              (user) =>
                 !searchResults?.some(
                    (searchedUser) => searchedUser.email === user.email
                 ) && user.email !== query
           )
         : selectedUsers

   const totalItems = [...filteredSelectedUsers, ...searchResults]

   return (
      <Command
         filter={(value, search) => {
            if (
               value.includes(search.toLowerCase()) ||
               selectedUsers.some((u) => u.email?.includes(value))
            )
               return 1
            return 0
         }}
         className={cn("h-[355px] rounded-sm border shadow-sm", className)}
         {...props}
      >
         <CommandInput
            autoFocus
            value={query}
            onValueChange={(val) => {
               setQuery(val)
               if (isEmail(val)) {
                  setIsEmailHintVisible(false)
               }
            }}
            name="invite"
            id="invite"
            placeholder="name@example.com"
         />
         {query.length < 1 && selectedUsers.length < 1 && (
            <p className="p-2 text-sm text-muted-foreground">{t("empty")}</p>
         )}
         {
            <CommandList>
               <CommandGroup>
                  {query.length > 0 &&
                     !searchResults?.some((u) => u.email === query) && (
                        <UserItem
                           emailHint={emailHint}
                           user={{
                              id: GUEST_USER_ID,
                              email: query,
                           }}
                           isEmailHintVisible={isEmailHintVisible}
                           onSelect={onUserSelect}
                           selectedUsers={selectedUsers}
                        />
                     )}
                  {!isFetching &&
                     searchResults?.map((user) => (
                        <UserItem
                           key={user.email}
                           emailHint={emailHint}
                           user={user}
                           onSelect={onUserSelect}
                           selectedUsers={selectedUsers}
                        />
                     ))}

                  {[...filteredSelectedUsers].reverse().map((user) => (
                     <UserItem
                        key={user.email}
                        emailHint={emailHint}
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
                        .map((_item, idx) => <UserItemSkeleton key={idx} />)}
               </CommandGroup>
            </CommandList>
         }
      </Command>
   )
}

function UserItem({
   user,
   selectedUsers,
   onSelect,
   isEmailHintVisible = false,
   emailHint,
}: {
   user: CommandItemUser
   selectedUsers: CommandItemUser[]
   onSelect: (user: CommandItemUser) => void
   isEmailHintVisible?: boolean
   emailHint: string
}) {
   const isSelected = selectedUsers.some((u) => u.email === user.email)

   return (
      <CommandItem
         className="flex items-center gap-2"
         value={user.email}
         onSelect={() => onSelect(user)}
      >
         <UserAvatar user={user} />
         <div className="w-full">
            <p className="truncate">
               {user.firstName} {user.lastName}{" "}
            </p>
            <p className="flex w-full items-center text-foreground/75">
               <span className="line-clamp-1 break-all">{user.email}</span>
               <span
                  className={cn(
                     "ml-auto whitespace-nowrap text-xs font-medium text-primary",
                     isEmail(user?.email ?? "") && !isEmailHintVisible
                        ? "hidden"
                        : !isEmailHintVisible
                        ? "invisible"
                        : ""
                  )}
               >
                  {emailHint}
               </span>
            </p>
         </div>

         <span
            className={cn(
               "ml-auto grid h-6 w-6 flex-shrink-0 place-content-center rounded-full bg-primary",
               isEmailHintVisible
                  ? "hidden"
                  : isSelected && !isEmailHintVisible
                  ? ""
                  : "invisible"
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
