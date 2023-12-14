import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip"
import { type TooltipProps } from "@radix-ui/react-tooltip"
import { type ComponentProps } from "react"

type HintProps = ComponentProps<"div"> & TooltipProps & { content: string }

export function Hint({ children, content, ...props }: HintProps) {
   return (
      <TooltipProvider>
         <Tooltip
            delayDuration={250}
            {...props}
         >
            <TooltipTrigger
               onFocus={(e) => e.preventDefault()}
               asChild
            >
               {children}
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
