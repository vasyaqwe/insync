"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Drawer } from "vaul"
import { MOBILE_BREAKPOINT } from "@/config"

const innerWidth = typeof window === "undefined" ? 0 : window.innerWidth

const Dialog =
   innerWidth < MOBILE_BREAKPOINT ? Drawer.Root : DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal =
   innerWidth < MOBILE_BREAKPOINT ? Drawer.Portal : DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
   React.ElementRef<typeof DialogPrimitive.Overlay>,
   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
   <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
         "fixed inset-0 z-[49] bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
         className
      )}
      {...props}
   />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
   React.ElementRef<typeof Drawer.Content>,
   React.ComponentPropsWithoutRef<typeof Drawer.Content> & {
      closeButtonClassName?: string
   }
>(({ className, children, closeButtonClassName, ...props }, ref) =>
   innerWidth < MOBILE_BREAKPOINT ? (
      <Drawer.Portal>
         <Drawer.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
         <Drawer.Content
            ref={ref}
            className={cn(
               "fixed bottom-0 left-0 right-0 z-50 flex !max-w-full flex-col rounded-t-2xl border-t border-border bg-popover pt-4 focus-visible:outline-none",
               className
            )}
            {...props}
         >
            <div
               aria-hidden={true}
               className="mx-auto mb-5 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted"
            />
            <div className="max-h-[90svh] overflow-y-auto px-4 pb-6 pt-4">
               {children}
            </div>
         </Drawer.Content>
      </Drawer.Portal>
   ) : (
      <DialogPrimitive.Portal>
         <DialogOverlay />
         <DialogPrimitive.Content
            ref={ref}
            className={cn(
               "fixed left-[50%] top-[50%] z-50 flex max-h-[90vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col overflow-y-auto rounded-lg border border-border bg-background p-5 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] md:w-full",
               className
            )}
            {...props}
         >
            {children}
            <DialogClose
               asChild
               className={cn(
                  "absolute right-4 top-4 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                  closeButtonClassName
               )}
            >
               <Button
                  size={"icon"}
                  variant={"ghost"}
               >
                  <X
                     width={20}
                     height={20}
                  />
                  <span className="sr-only">Close</span>
               </Button>
            </DialogClose>
         </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
   )
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
   <div
      className={cn("-mt-1", className)}
      {...props}
   />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
   <div
      className={cn(
         "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
         className
      )}
      {...props}
   />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
   React.ElementRef<typeof DialogPrimitive.Title>,
   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
   <DialogPrimitive.Title
      ref={ref}
      className={cn(
         "leading-2 text-2xl font-semibold tracking-tight",
         className
      )}
      {...props}
   />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
   React.ElementRef<typeof DialogPrimitive.Description>,
   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
   <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
   />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
   Dialog,
   DialogPortal,
   DialogOverlay,
   DialogTrigger,
   DialogClose,
   DialogContent,
   DialogHeader,
   DialogFooter,
   DialogTitle,
   DialogDescription,
}
