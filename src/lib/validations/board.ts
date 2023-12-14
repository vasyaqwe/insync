import { z } from "zod"

export const NAME_CHARS_LIMIT = 32

export const createBoardSchema = z.object({
   name: z
      .string()
      .min(1, { message: "required" })
      .max(NAME_CHARS_LIMIT, { message: "max-limit" }),
   organizationId: z.string(),
})
