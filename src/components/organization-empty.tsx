"use client"

import { Button } from "@/components/ui/button"
import { Card, type CardProps } from "@/components/ui/card"
// import { useIsClient } from "@/hooks/use-is-client"
// import { useOrganizationHelpers } from "@/hooks/use-organization-helpers"
import { cn } from "@/lib/utils"
import { useGlobalStore } from "@/stores/use-global-store"
import { useTranslations } from "next-intl"
// import { useEffect } from "react"
import { useShallow } from "zustand/react/shallow"

type OrganizationEmptyProps = CardProps

export function OrganizationEmpty({
   className,
   ...props
}: OrganizationEmptyProps) {
   const t = useTranslations("sidebar")
   // const { isClient } = useIsClient()
   const { openDialog } = useGlobalStore(
      useShallow((state) => ({
         openDialog: state.openDialog,
      }))
   )

   // const { setLastVisitedOrganizationId } = useOrganizationHelpers()

   // useEffect(() => {
   //    isClient && setLastVisitedOrganizationId("")
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [isClient])

   return (
      <Card
         className={cn(
            "mx-auto p-6 text-center text-lg md:px-10 md:py-6",
            className
         )}
         {...props}
      >
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
