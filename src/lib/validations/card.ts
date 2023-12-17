import { z } from "zod"

export const NAME_CHARS_LIMIT = 32

const cardNameSchema = z
   .string()
   .min(1, { message: "required" })
   .max(NAME_CHARS_LIMIT, { message: "max-limit" })

export const createCardSchema = z.object({
   name: cardNameSchema,
   listId: z.string(),
})

export const deleteCardSchema = z.object({
   cardId: z.string(),
})

export const updateCardSchema = z.object({
   cardId: z.string(),
   name: cardNameSchema,
})

export const updateCardOrderSchema = z.object({
   items: z.array(
      z.object({ order: z.number(), id: z.string(), listId: z.string() })
   ),
})
