import { defaultLocale, locales } from "@/navigation"
import { authMiddleware } from "@clerk/nextjs"
import createMiddleware from "next-intl/middleware"

const intlMiddleware = createMiddleware({
   locales: locales,
   defaultLocale: defaultLocale,
})

export default authMiddleware({
   beforeAuth(request) {
      return intlMiddleware(request)
   },

   // Ensure that locale-specific sign in pages are public
   publicRoutes: [
      "/:locale",
      "/:locale/sign-in",
      "/:locale/sign-up",
      "/api/webhook",
      "/",
   ],
})

export const config = {
   // Match only internationalized pathnames
   matcher: ["/", "/(ua|en)/:path*"],
}
