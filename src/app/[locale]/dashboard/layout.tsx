import { cookies } from "next/headers"
import { Toaster } from "sonner"

import { TRPCReactProvider } from "@/trpc/react"

export default function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <TRPCReactProvider cookies={cookies().toString()}>
         {children}
         <Toaster
            richColors
            style={{ font: "inherit" }}
         />
      </TRPCReactProvider>
   )
}
