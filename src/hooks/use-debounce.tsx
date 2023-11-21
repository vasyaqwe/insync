import { useEffect, useState } from "react"

type UseDebounceArgs<T extends string> = {
   value: T
   delay?: number
}

export function useDebounce<T extends string>({
   value,
   delay,
}: UseDebounceArgs<T>): T {
   const [debouncedValue, setDebouncedValue] = useState<T>(value)

   useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), 500)

      return () => {
         clearTimeout(timer)
      }
   }, [value, delay])

   return debouncedValue
}
