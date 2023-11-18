import { createLocalizedPathnamesNavigation } from "next-intl/navigation"

import { type Pathnames } from "next-intl/navigation"

export const locales = ["en", "ua"] as const
export const defaultLocale = "en"

const pathnames = {
   "/": "/",
   "/sign-in": {
      en: "/sign-in",
      ua: "/увійти",
   },
   "/sign-up": {
      en: "/sign-up",
      ua: "/реєстрація",
   },
   "/dashboard": {
      en: "/dashboard",
      ua: "/огляд",
   },
} satisfies Pathnames<typeof locales>

export type AppPathnames = keyof typeof pathnames

export const { Link, redirect, usePathname, useRouter } =
   createLocalizedPathnamesNavigation({
      locales,
      pathnames,
   })
