import { defaultLocale, getLocaleOrDefault, locales } from "@/navigation"
import { authMiddleware } from "@clerk/nextjs"
import createMiddleware from "next-intl/middleware"

const intlMiddleware = createMiddleware({
   locales,
   defaultLocale,
})

export default authMiddleware({
   afterAuth: (auth, req) => {
      if (req.url.includes("/api/trpc/")) return

      if (auth.userId ?? auth.isPublicRoute) return

      const locale = getLocaleOrDefault(req)
      req.nextUrl.pathname = `/${locale}/sign-in`
      return Response.redirect(req.nextUrl)
   },
   beforeAuth(req) {
      if (req.url.includes("/api/trpc/")) return

      return intlMiddleware(req)
   },

   // Ensure that locale-specific sign in pages are public
   publicRoutes: [
      "/:locale",
      "/:locale/sign-in",
      "/:locale/sign-up",
      "/api/webhook/user",
   ],
})

export const config = {
   matcher: [
      "/(uk|en)/:path*",
      "/((?!.+\\.[\\w]+$|_next).*)",
      "/",
      "/(api|trpc)(.*)",
   ],
}
