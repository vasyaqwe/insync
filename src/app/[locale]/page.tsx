import { Button } from "@/components/ui/button"
import { Link } from "@/navigation"
import { currentUser } from "@clerk/nextjs"
import { ArrowUpRight } from "lucide-react"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

export default async function Home({
   params: { locale },
}: {
   params: { locale: string }
}) {
   // Enable static rendering
   unstable_setRequestLocale(locale)

   const t = await getTranslations("landing-page")
   const user = await currentUser()

   return (
      <>
         <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl"
         >
            <div
               style={{
                  clipPath:
                     "polygon(100% 0%, 71% 46%, 100% 100%, 25% 100%, 55% 29%, 15% 12%)",
               }}
               className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] 
               bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
         </div>
         <section className="flex flex-col items-center justify-center space-y-5 py-32">
            <h1
               dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }}
               className="text-center text-4xl font-bold leading-tight lg:text-6xl"
            ></h1>
            <p
               dangerouslySetInnerHTML={{ __html: t.raw("hero.description") }}
               className="mx-auto max-w-[55ch] text-center text-foreground/75"
            ></p>
            <Button
               className="text-center"
               asChild
            >
               <Link href={user ? "/dashboard" : "/sign-up"}>
                  {t("hero.button")}
                  <ArrowUpRight />
               </Link>
            </Button>
         </section>
      </>
   )
}
