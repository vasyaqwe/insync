import { z } from "zod"

export const NAME_CHARS_LIMIT = 32

export const updateUserSchema = z.object({
   firstName: z
      .string()
      .min(1, { message: "required" })
      .max(NAME_CHARS_LIMIT, { message: "max-limit" }),
   lastName: z
      .string()
      .min(1, { message: "required" })
      .max(NAME_CHARS_LIMIT, { message: "max-limit" }),
   imageUrl: z.string().url(),
})
