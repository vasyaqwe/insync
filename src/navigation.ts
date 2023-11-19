import { createLocalizedPathnamesNavigation } from "next-intl/navigation"

import { type Pathnames } from "next-intl/navigation"
import { type NextRequest } from "next/server"

export const locales = ["en", "uk"] as const
export const defaultLocale = "en"

const pathnames = {
   "/": "/",
   "/sign-in": {
      en: "/sign-in",
      uk: "/увійти",
   },
   "/sign-up": {
      en: "/sign-up",
      uk: "/реєстрація",
   },
   "/dashboard": {
      en: "/dashboard",
      uk: "/огляд",
   },
} satisfies Pathnames<typeof locales>

export type AppPathnames = keyof typeof pathnames

export const { Link, redirect, usePathname, useRouter } =
   createLocalizedPathnamesNavigation({
      locales,
      pathnames,
   })

export function getLocaleOrDefault(req: NextRequest) {
   const headers = req.headers
   const language = headers.get("Accept-Language")?.slice(0, 2)

   if (locales.some((l) => l === language)) {
      return language
   }

   return defaultLocale
}
