import { z } from "zod"

export const NAME_CHARS_LIMIT = 32

const boardNameSchema = z
   .string()
   .min(1, { message: "required" })
   .max(NAME_CHARS_LIMIT, { message: "max-limit" })

export const createBoardSchema = z.object({
   name: boardNameSchema,
   organizationId: z.string(),
})

export const deleteBoardSchema = z.object({
   boardId: z.string(),
})
export const updateBoardSchema = z.object({
   boardId: z.string(),
   name: boardNameSchema,
})
