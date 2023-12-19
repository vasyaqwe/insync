import { BackToDashboardLink } from "@/components/actions/back-to-dashboard-link"
import { getTranslations } from "next-intl/server"

export default async function NotFound() {
   const t = await getTranslations("common")

   return (
      <div className="grid h-[calc(100svh-var(--header-height))] w-full place-content-center gap-3 text-center">
         <h1 className=" text-4xl font-bold">404</h1>
         <p>{t("not-found")}</p>
         <BackToDashboardLink
            className="mt-2"
            text={t("go-to-dashboard")}
         />
      </div>
   )
}
