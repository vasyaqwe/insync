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
