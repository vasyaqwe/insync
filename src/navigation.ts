import { createSharedPathnamesNavigation } from "next-intl/navigation"

import { type NextRequest } from "next/server"

export const locales = ["en", "uk"] as const
export const defaultLocale = "en"
export type Locale = (typeof locales)[number]

export const { Link, redirect, usePathname, useRouter } =
   createSharedPathnamesNavigation({
      locales,
   })

export function getLocaleOrDefault(req: NextRequest) {
   const language = req.nextUrl.pathname.slice(1, 3)

   if (locales.some((l) => l === language)) {
      return language
   }

   return defaultLocale
}
