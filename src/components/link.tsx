import { type AppPathnames, Link as NextLink } from "@/navigation"
import { type ComponentProps } from "react"

export function Link<Pathname extends AppPathnames>({
   href,
   ...rest
}: ComponentProps<typeof NextLink<Pathname>>) {
   return (
      <NextLink
         href={href}
         {...rest}
      />
   )
}
