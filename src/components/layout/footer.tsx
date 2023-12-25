import { getTranslations } from "next-intl/server"
import React from "react"

export async function Footer() {
   const now = new Date()
   const currentYear = now.getFullYear()
   const t = await getTranslations("footer")

   return (
      <footer className="mt-auto bg-background py-5 text-center text-xs text-muted-foreground shadow-sm shadow-foreground">
         <div className="container">
            <p
               dangerouslySetInnerHTML={{
                  __html: t.rich("title", { currentYear }),
               }}
               className=""
            ></p>
            <p className="mt-2">{t("1")}</p>
            {/* <p className="mt-2">
               {t("2")}{" "}
               <a
                  className="underline hover:no-underline"
                  href="https://github.com/vasyaqwe/insync"
                  target="_blank"
               >
                  Github
               </a>
               .
            </p> */}
         </div>
      </footer>
   )
}
