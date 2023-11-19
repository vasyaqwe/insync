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
