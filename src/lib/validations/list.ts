import { z } from "zod"

export const NAME_CHARS_LIMIT = 32

const listNameSchema = z
   .string()
   .min(1, { message: "required" })
   .max(NAME_CHARS_LIMIT, { message: "max-limit" })

export const createListSchema = z.object({
   name: listNameSchema,
   boardId: z.string(),
})

export const deleteListSchema = z.object({
   listId: z.string(),
})
export const updateListSchema = z.object({
   listId: z.string(),
   name: listNameSchema,
})
