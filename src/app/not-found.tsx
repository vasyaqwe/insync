"use client"

export default function NotFound() {
   return (
      <div className="grid h-[calc(100svh-var(--header-height))] w-full place-content-center gap-3 text-center">
         <h1 className=" text-4xl font-bold">404</h1>
         <div>
            <h2>This page could not be found.</h2>
         </div>
      </div>
   )
}
