import { cn } from "@/lib/utils"

type LoadingProps = React.ComponentProps<"span">

export function Loading({ className, ...props }: LoadingProps) {
   return (
      <span
         className={cn(
            "inline-flex min-h-[23px] items-center gap-px",
            className
         )}
         {...props}
      >
         <span className="animate-blink mx-px h-[5px] w-[5px] rounded-full bg-current"></span>
         <span className="animate-blink animation-delay-150 mx-px h-[5px] w-[5px] rounded-full bg-current"></span>
         <span className="animate-blink animation-delay-300 mx-px h-[5px] w-[5px] rounded-full bg-current"></span>
      </span>
   )
}
