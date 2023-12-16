import { cn } from "@/lib/utils"
import { type ComponentProps } from "react"

type ColorAvatarProps = ComponentProps<"div"> & { color: string }

export function ColorAvatar({ className, color, ...props }: ColorAvatarProps) {
   return (
      <div
         className={cn(
            "h-[var(--color-avatar-size)] w-[var(--color-avatar-size)] rounded-full",
            className
         )}
         style={{ background: color }}
         {...props}
      ></div>
   )
}
