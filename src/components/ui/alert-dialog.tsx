"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Drawer } from "vaul"
import { MOBILE_BREAKPOINT } from "@/config"

const innerWidth = typeof window === "undefined" ? 0 : window.innerWidth

const AlertDialog =
   innerWidth < MOBILE_BREAKPOINT ? Drawer.Root : AlertDialogPrimitive.Root

const AlertDialogTrigger =
   innerWidth < MOBILE_BREAKPOINT
      ? Drawer.Trigger
      : AlertDialogPrimitive.Trigger

const AlertDialogPortal =
   innerWidth < MOBILE_BREAKPOINT ? Drawer.Portal : AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
   React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
   <AlertDialogPrimitive.Overlay
      className={cn(
         "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
         className
      )}
      {...props}
      ref={ref}
   />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
   React.ElementRef<typeof AlertDialogPrimitive.AlertDialogContent>,
   React.ComponentPropsWithoutRef<
      typeof AlertDialogPrimitive.AlertDialogContent
   >
>(({ className, children, ...props }, ref) =>
   innerWidth < MOBILE_BREAKPOINT ? (
      <Drawer.Portal>
         <Drawer.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
         <Drawer.Content
            ref={ref}
            className={cn(
               "fixed bottom-0 left-0 right-0 z-[51] mt-14 flex flex-col rounded-t-2xl border-t border-border bg-popover p-4 focus-visible:outline-none",
               className
            )}
            {...props}
         >
            <div
               aria-hidden={true}
               className="mx-auto mb-5 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted"
            />
            <div className="overflow-y-auto px-1">{children}</div>
         </Drawer.Content>
      </Drawer.Portal>
   ) : (
      <AlertDialogPortal>
         <AlertDialogOverlay />
         <AlertDialogPrimitive.Content
            ref={ref}
            className={cn(
               "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
               className
            )}
            {...props}
         >
            {children}
         </AlertDialogPrimitive.Content>
      </AlertDialogPortal>
   )
)
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
   <div
      className={cn(
         "flex flex-col space-y-2 text-center sm:text-left",
         className
      )}
      {...props}
   />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
   <div
      className={cn("flex justify-center max-md:my-5 md:mt-3", className)}
      {...props}
   />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
   React.ElementRef<typeof AlertDialogPrimitive.Title>,
   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) =>
   innerWidth < MOBILE_BREAKPOINT ? (
      <Drawer.Title
         ref={ref}
         className={cn("mb-2 text-2xl font-semibold", className)}
         {...props}
      />
   ) : (
      <AlertDialogPrimitive.Title
         ref={ref}
         className={cn("mb-2 text-xl font-semibold", className)}
         {...props}
      />
   )
)
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
   React.ElementRef<typeof AlertDialogPrimitive.Description>,
   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) =>
   innerWidth < MOBILE_BREAKPOINT ? (
      <Drawer.Description
         ref={ref}
         className={cn("text-sm text-muted-foreground", className)}
         {...props}
      />
   ) : (
      <AlertDialogPrimitive.Description
         ref={ref}
         className={cn("text-sm text-muted-foreground", className)}
         {...props}
      />
   )
)
AlertDialogDescription.displayName =
   AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
   React.ElementRef<typeof AlertDialogPrimitive.Action>,
   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
   <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(buttonVariants(), className)}
      {...props}
   />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
   React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
   <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(
         buttonVariants({ variant: "outline" }),
         "mt-2 sm:mt-0",
         className
      )}
      {...props}
   />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
   AlertDialog,
   AlertDialogPortal,
   AlertDialogOverlay,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogFooter,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogAction,
   AlertDialogCancel,
}
