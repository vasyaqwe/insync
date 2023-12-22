import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function pick<T extends object, K extends keyof T>(
   obj: T,
   keys: K[]
): Pick<T, K> {
   return keys.reduce(
      (acc, key) => {
         if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
            acc[key] = obj[key]
         }
         return acc
      },
      {} as Pick<T, K>
   )
}

export function isEmail(email: string) {
   return String(email)
      .toLowerCase()
      .match(
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
}

export function focusContentEditableElement(
   contentEditableElement: HTMLElement | null
) {
   if (!contentEditableElement) return

   contentEditableElement?.focus()

   const range = document.createRange() //Create a range (a range is a like the selection but invisible)
   range.selectNodeContents(contentEditableElement) //Select the entire contents of the element with the range
   range.collapse(false) //collapse the range to the end point. false means collapse to end rather than the start

   const selection = window.getSelection() //get the selection object (allows you to change selection)
   selection?.removeAllRanges() //remove any selections already made
   selection?.addRange(range) //make the range you have just created the visible selection
}
