import { Link } from "@/components/link"
import { Button } from "@/components/ui/button"
import logo from "@public/logo.svg"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

export function Header() {
   const t = useTranslations("header")

   return (
      <header className=" bg-background/60 py-3 shadow-sm backdrop-blur-md">
         <div className="container flex items-center justify-between">
            <Link href={"/"}>
               <Image
                  src={logo}
                  alt="insync."
               />
            </Link>
            <Button
               size={"sm"}
               className="text-center"
               asChild
            >
               <Link href={"/sign-up"}>
                  {t("button")}
                  <ArrowUpRight />
               </Link>
            </Button>
         </div>
      </header>
   )
}
