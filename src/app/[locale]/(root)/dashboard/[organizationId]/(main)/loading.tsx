import { Skeleton } from "@/components/ui/skeleton"
import { getTranslations } from "next-intl/server"

export default async function Page() {
   const t = await getTranslations("boards")

   return (
      <div>
         <h1 className="mt-3 text-2xl font-medium md:mt-4 md:text-3xl">
            {t("title")}
         </h1>
         <div className="mt-5 grid grid-cols-fluid gap-4">
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
         </div>
      </div>
   )
}
