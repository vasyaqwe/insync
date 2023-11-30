import { cn } from "@/lib/utils"
import { type ComponentProps } from "react"

type ColorAvatarProps = ComponentProps<"div"> & { color: string }

export function ColorAvatar({ className, color, ...props }: ColorAvatarProps) {
   return (
      <div
         className={cn("h-8 w-8 rounded-full", className)}
         style={{ background: color }}
         {...props}
      ></div>
   )
}
