import { z } from "zod"

export const NAME_CHARS_LIMIT = 48

const listNameSchema = z
   .string()
   .min(1, { message: "required" })
   .max(NAME_CHARS_LIMIT, { message: "max-limit" })

export const getAllListsSchema = z.object({
   boardId: z.string(),
})
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

export const updateListOrderSchema = z.object({
   items: z.array(z.object({ order: z.number(), id: z.string() })),
})
