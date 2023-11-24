import {
   GUEST_USER_ID,
   createOrganizationSchema,
} from "@/lib/validations/organization"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { nanoid } from "nanoid"

export const organizationRouter = createTRPCRouter({
   create: privateProcedure
      .input(createOrganizationSchema)
      .mutation(async ({ ctx, input: { invitedUsers, name } }) => {
         await ctx.db.$transaction(async (tx) => {
            const createdOrganization = await tx.organization.create({
               data: {
                  name,
               },
            })
            if (invitedUsers.length > 0) {
               const currentTimestamp = new Date()
               const expiresAt = new Date(currentTimestamp.getTime() + 60000)

               const currentUser = await tx.user.findFirst({
                  where: {
                     externalId: ctx.session.userId,
                  },
               })

               if (!currentUser) {
                  throw new TRPCError({
                     code: "BAD_REQUEST",
                     message:
                        "An unexpected error occurred, please try again later.",
                  })
               }

               for (const invitedUser of invitedUsers) {
                  await tx.organizationInvitation.create({
                     data: {
                        invitationSenderId: currentUser.id,
                        invitedUserEmail: invitedUser.email,
                        invitedUserId:
                           invitedUser.id === GUEST_USER_ID
                              ? null
                              : invitedUser.id,
                        expiresAt,
                        token: nanoid(),
                        organizationId: createdOrganization.id,
                        status: "PENDING",
                     },
                  })
               }
            }
         })
         return "OK"
      }),
})
