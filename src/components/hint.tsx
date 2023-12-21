import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip"
import { type TooltipProps } from "@radix-ui/react-tooltip"
import { type ComponentProps } from "react"

type HintProps = ComponentProps<"div"> &
   TooltipProps & { content: string; delayDuration?: number }

export function Hint({
   children,
   content,
   delayDuration,
   ...props
}: HintProps) {
   return (
      <TooltipProvider>
         <Tooltip
            delayDuration={delayDuration ?? 250}
            {...props}
         >
            <TooltipTrigger
               onFocus={(e) => e.preventDefault()}
               asChild
            >
               <span>{children}</span>
            </TooltipTrigger>
            <TooltipContent
               hideWhenDetached
               className="break-words text-sm"
            >
               {content}
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   )
}
