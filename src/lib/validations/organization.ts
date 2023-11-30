import { type User } from "@prisma/client"
import { z } from "zod"

export const GUEST_USER_ID = "guest"
export const NAME_CHARS_LIMIT = 32
export type InvitedUser = Partial<User> & { email: string; id: string }

const invitedUserSchema: z.ZodType<InvitedUser> = z.object({
   createdAt: z.date().optional(),
   email: z.string(),
   externalId: z.string().optional(),
   id: z.string(),
   firstName: z.string().optional(),
   lastName: z.string().optional(),
   imageUrl: z.string().url().optional(),
   updatedAt: z.date().optional(),
})

export const deleteOrganizationSchema = z.object({
   organizationId: z.string(),
})

export const createOrganizationSchema = z.object({
   name: z
      .string()
      .min(1, { message: "required" })
      .max(NAME_CHARS_LIMIT, { message: "max-limit" }),
   invitedUsers: z.array(invitedUserSchema).default([]),
})

export const acceptOrganizationInvitationSchema = z.object({
   invitationId: z.string(),
   organizationId: z.string(),
   token: z.string(),
})

export type AcceptOrganizationInvitationSchema = z.infer<
   typeof acceptOrganizationInvitationSchema
>
