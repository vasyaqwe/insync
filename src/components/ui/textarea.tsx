import * as React from "react"
import { cn } from "@/lib/utils"
import TextareaAutosize, {
   type TextareaAutosizeProps,
} from "react-textarea-autosize"

export type TextareaProps = TextareaAutosizeProps & {
   invalid?: string | undefined
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
   ({ className, invalid, ...props }, ref) => {
      return (
         <TextareaAutosize
            data-invalid={Boolean(invalid)}
            className={cn(
               `flex w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-ring 
                    ring-offset-2 ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none
                     focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 data-[invalid=true]:ring-2
                     data-[invalid=true]:ring-destructive
                     `,
               className
            )}
            ref={ref}
            {...props}
         />
      )
   }
)
Textarea.displayName = "Textarea"

export { Textarea }
