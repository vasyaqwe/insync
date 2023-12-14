import { DateDisplay } from "@/components/date"
import { Card } from "@/components/ui/card"
import { Link } from "@/navigation"
import { type Board } from "@prisma/client"
import { CalendarPlus } from "lucide-react"
import { useTranslations } from "next-intl"

type BoardProps = {
   board: Board
}
export function Board({ board }: BoardProps) {
   const t = useTranslations("boards")

   return (
      <Card
         key={board.id}
         className="h-[120px] p-0 transition hover:opacity-80"
      >
         <Link href={`/dashboard/board/${board.id}`}>
            <div className="p-4">
               <h3 className="truncate text-xl font-medium">{board.name}</h3>
            </div>
            <div className="border-t-2 border-dotted p-4">
               <p className="text-sm text-foreground/75">
                  <CalendarPlus
                     className="mr-1 inline align-sub "
                     size={18}
                  />
                  {t("created")} <DateDisplay date={board.createdAt} />
               </p>
            </div>
         </Link>
      </Card>
   )
}
