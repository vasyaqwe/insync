export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <div className="grid h-[calc(100svh-var(--header-height))] place-content-center">
         {children}
      </div>
   )
}
