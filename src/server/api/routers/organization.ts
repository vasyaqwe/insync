import {
   GUEST_USER_ID,
   acceptOrganizationInvitationSchema,
   createOrganizationSchema,
   deleteOrganizationSchema,
} from "@/lib/validations/organization"
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { nanoid } from "nanoid"

export const organizationRouter = createTRPCRouter({
   create: privateProcedure
      .input(createOrganizationSchema)
      .mutation(async ({ ctx, input: { invitedUsers, name } }) => {
         const createdOrganization = await ctx.db.$transaction(async (tx) => {
            const createdOrganization = await tx.organization.create({
               data: {
                  name,
                  color: generateRandomGradientColor(),
                  members: {
                     connect: {
                        id: ctx.session.userId,
                     },
                  },
               },
            })

            if (invitedUsers.length > 0) {
               for (const invitedUser of invitedUsers) {
                  await tx.organizationInvitation.create({
                     data: {
                        senderId: ctx.session.userId!,
                        invitedUserEmail: invitedUser.email,
                        invitedUserId:
                           invitedUser.id === GUEST_USER_ID
                              ? null
                              : invitedUser.id,
                        token: nanoid(),
                        organizationId: createdOrganization.id,
                     },
                  })
               }
            }

            return createdOrganization
         })

         return createdOrganization.id
      }),
   delete: privateProcedure
      .input(deleteOrganizationSchema)
      .mutation(async ({ ctx, input: { organizationId } }) => {
         await ctx.db.organization.delete({
            where: {
               id: organizationId,
            },
         })
         return "OK"
      }),
   acceptInvitation: privateProcedure
      .input(acceptOrganizationInvitationSchema)
      .mutation(
         async ({ ctx, input: { invitationId, token, organizationId } }) => {
            const invitation = await ctx.db.organizationInvitation.findFirst({
               where: {
                  id: invitationId,
               },
            })

            if (
               !invitation ||
               invitation.invitedUserEmail !== ctx.session.user?.email ||
               token !== invitation.token
            ) {
               throw new TRPCError({
                  code: "BAD_REQUEST",
                  message:
                     "An unexpected error occurred, please try again later.",
               })
            }

            await ctx.db.organization.update({
               where: {
                  id: organizationId,
               },
               data: {
                  members: {
                     connect: {
                        id: ctx.session.userId,
                     },
                  },
               },
            })

            await ctx.db.organizationInvitation.delete({
               where: {
                  id: invitationId,
               },
            })

            return "OK"
         }
      ),
})

function generateRandomGradientColor() {
   const letters = "0123456789ABCDEF"
   let color1 = "#"
   let color2 = "#"

   // Generating two random hex colors for gradient effect
   for (let i = 0; i < 6; i++) {
      color1 += letters[Math.floor(Math.random() * 16)]
      color2 += letters[Math.floor(Math.random() * 16)]
   }

   // Returning gradient color string
   return `linear-gradient(135deg, ${color1}, ${color2})`
}
