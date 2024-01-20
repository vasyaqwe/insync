import { type TRPCError } from "@trpc/server"
import { useState } from "react"

type UseActionArgs<TOutput> = {
   onSuccess?: (data: TOutput) => void
   onError?: (error: TRPCError) => void
   onSettled?: () => void
}

export const useAction = <TInput, TOutput>(
   action: (data: TInput) => Promise<TOutput>,
   options: UseActionArgs<TOutput> = {}
) => {
   const [error, setError] = useState<TRPCError | undefined>(undefined)
   const [data, setData] = useState<TOutput | undefined>(undefined)
   const [isPending, setIsPending] = useState<boolean>(false)

   const execute = async (input: TInput) => {
      setIsPending(true)

      try {
         const res = await action(input)
         setData(res)
         options.onSuccess?.(res)
      } catch (err) {
         const error = err as TRPCError
         setError(error)
         return options.onError?.(error)
      } finally {
         setIsPending(false)
         options.onSettled?.()
      }
   }

   return {
      execute,
      error,
      data,
      isPending,
   }
}
