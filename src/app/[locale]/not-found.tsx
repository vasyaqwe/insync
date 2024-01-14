"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@/navigation"
import { useTranslations } from "next-intl"

export default function NotFound() {
   const t = useTranslations("common")

   return (
      <div className="grid h-svh w-full place-content-center gap-3 text-center">
         <h1 className="text-4xl font-bold">404</h1>
         <p>{t("not-found")}</p>
         <Button asChild>
            <Link
               className={cn("mt-2")}
               href={`/dashboard`}
            >
               {t("go-to-dashboard")}
            </Link>
         </Button>
      </div>
   )
}
