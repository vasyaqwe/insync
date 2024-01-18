import { Skeleton } from "@/components/ui/skeleton"
import { KanbanSquare } from "lucide-react"

export default function Page() {
   return (
      <div className="grid h-full grid-cols-full-width-split-screen py-10 lg:py-12">
         <div className="col-start-2 col-end-5 md:pl-[var(--container-padding-inline)]">
            <h1 className="mt-2 flex items-center text-3xl font-medium">
               <KanbanSquare
                  className="mr-2"
                  size={26}
               />
               <Skeleton className="h-5 w-40 rounded-lg" />
            </h1>
            <div className="flex h-full items-start gap-4 overflow-x-auto pr-4">
               <div className="mt-6 flex items-start gap-4">
                  <div className="w-[18rem] space-y-2 p-3">
                     <Skeleton className="h-[20vh] w-full rounded-lg" />
                  </div>
                  <div className="w-[18rem] space-y-2 p-3">
                     <Skeleton className="h-[40vh] w-full rounded-lg" />
                  </div>
                  <div className="w-[18rem] space-y-2 p-3">
                     <Skeleton className="h-[30vh] w-full rounded-lg" />
                  </div>
                  <div className="w-[18rem] space-y-2 p-3">
                     <Skeleton className="h-[45vh] w-full rounded-lg" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
