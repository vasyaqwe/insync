import { z } from "zod"

export const NAME_CHARS_LIMIT = 64

const cardNameSchema = z
   .string()
   .min(1, { message: "required" })
   .max(NAME_CHARS_LIMIT, { message: "max-limit" })

export const createCardSchema = z.object({
   name: cardNameSchema,
   listId: z.string(),
})

export const getCardItemsSchema = z.object({
   cardId: z.string(),
})

export const createCardCommentSchema = z.object({
   cardId: z.string(),
   content: z.string(),
})
export const deleteCardCommentSchema = z.object({
   commentId: z.string(),
})

export const deleteCardSchema = z.object({
   cardId: z.string(),
})

export const updateCardSchema = z.object({
   cardId: z.string(),
   name: cardNameSchema,
   description: z.string().optional(),
})

export const updateCardOrderSchema = z.object({
   items: z.array(
      z.object({ order: z.number(), id: z.string(), listId: z.string() })
   ),
   destinationListName: z.string().optional(),
   sourceListName: z.string().optional(),
   movedCard: z
      .object({
         id: z.string(),
         name: z.string(),
         organizationId: z.string(),
      })
      .optional(),
})
