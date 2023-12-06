import { type User } from "@prisma/client"
import { z } from "zod"

export const GUEST_USER_ID = "guest"
export const NAME_CHARS_LIMIT = 32
export type InvitedUser = Partial<User> & { email: string; id: string }

const invitedUserSchema: z.ZodType<InvitedUser> = z.object({
   createdAt: z.date().optional(),
   email: z.string(),
   id: z.string(),
   firstName: z.string().optional(),
   lastName: z.string().optional(),
   imageUrl: z.string().url().optional(),
   updatedAt: z.date().optional(),
})

const invitedUsersSchema = z.array(invitedUserSchema).default([])

export const deleteOrganizationSchema = z.object({
   organizationId: z.string(),
})
export const leaveOrganizationSchema = z.object({
   organizationId: z.string(),
})

export const inviteToOrganizationSchema = z.object({
   organizationId: z.string(),
   invitedUsers: invitedUsersSchema,
})

export const createOrganizationSchema = z.object({
   name: z
      .string()
      .min(1, { message: "required" })
      .max(NAME_CHARS_LIMIT, { message: "max-limit" }),
   invitedUsers: invitedUsersSchema,
})

export const acceptOrganizationInvitationSchema = z.object({
   invitationId: z.string(),
   organizationId: z.string(),
   token: z.string(),
})

export type AcceptOrganizationInvitationSchema = z.infer<
   typeof acceptOrganizationInvitationSchema
>
