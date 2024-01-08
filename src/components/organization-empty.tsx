"use client"

import { Button } from "@/components/ui/button"
import { Card, type CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useGlobalStore } from "@/stores/use-global-store"
import { useOrganizationHelpersStore } from "@/stores/use-organization-helpers-store"
import { Building2, PlusCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { useShallow } from "zustand/react/shallow"

type OrganizationEmptyProps = CardProps

export function OrganizationEmpty({
   className,
   ...props
}: OrganizationEmptyProps) {
   const t = useTranslations("sidebar")

   const { openDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
      }))
   )

   const { setLastVisitedOrganizationId } = useOrganizationHelpersStore()

   useEffect(() => {
      setLastVisitedOrganizationId("")
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <Card
         className={cn(
            "mx-auto p-6 text-center text-lg md:px-10 md:py-6",
            className
         )}
         {...props}
      >
         <div className="relative mx-auto mb-5 w-fit">
            <Building2
               size={52}
               strokeWidth={1.5}
            />
            <svg
               className="absolute -bottom-1 -right-2 size-6 rounded-full bg-white"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 24 24"
               fill="currentColor"
            >
               <path
                  className="fill-foreground dark:fill-background"
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                  clipRule="evenodd"
               />
            </svg>
         </div>
         <p>{t("empty")}</p>
         <Button
            size={"lg"}
            onClick={() => openDialog("createOrganization")}
            className="mt-6"
         >
            {t("empty-button")}
         </Button>
      </Card>
   )
}
