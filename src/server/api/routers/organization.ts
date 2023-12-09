import { OrganizationInviteEmail } from "@/components/emails/organization-invite-email"
import {
   GUEST_USER_ID,
   acceptOrganizationInvitationSchema,
   createOrganizationSchema,
   deleteOrganizationSchema,
   inviteToOrganizationSchema,
   kickOrganizationSchema,
   leaveOrganizationSchema,
} from "@/lib/validations/organization"
import {
   type TRPCContext,
   createTRPCRouter,
   privateProcedure,
} from "@/server/api/trpc"
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
                  ownerId: ctx.session.userId!,
                  members: {
                     connect: {
                        id: ctx.session.userId,
                     },
                  },
               },
            })

            if (invitedUsers.length > 0) {
               for (const invitedUser of invitedUsers) {
                  const createdInvitation =
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

                  await sendInviteEmail({
                     ctx,
                     invitedUserEmail: invitedUser.email,
                     organizationName: createdOrganization.name,
                     token: createdInvitation.token,
                  })
               }
            }

            return createdOrganization
         })

         return createdOrganization.id
      }),
   invite: privateProcedure
      .input(inviteToOrganizationSchema)
      .mutation(
         async ({
            ctx,
            input: { invitedUsers, organizationId, organizationName },
         }) => {
            for (const invitedUser of invitedUsers) {
               const existingInvitation =
                  await ctx.db.organizationInvitation.findFirst({
                     where: {
                        invitedUserEmail: invitedUser.email,
                     },
                     select: {
                        token: true,
                     },
                  })

               if (existingInvitation) {
                  await sendInviteEmail({
                     ctx,
                     invitedUserEmail: invitedUser.email,
                     organizationName: organizationName,
                     token: existingInvitation.token,
                  })
               } else {
                  const createdInvitation =
                     await ctx.db.organizationInvitation.create({
                        data: {
                           senderId: ctx.session.userId!,
                           invitedUserEmail: invitedUser.email,
                           invitedUserId:
                              invitedUser.id === GUEST_USER_ID
                                 ? null
                                 : invitedUser.id,
                           token: nanoid(),
                           organizationId: organizationId,
                        },
                     })

                  await sendInviteEmail({
                     ctx,
                     invitedUserEmail: invitedUser.email,
                     organizationName: organizationName,
                     token: createdInvitation.token,
                  })
               }
            }

            return "OK"
         }
      ),
   delete: privateProcedure
      .input(deleteOrganizationSchema)
      .mutation(async ({ ctx, input: { organizationId } }) => {
         const organization = await ctx.db.organization.findFirst({
            where: {
               id: organizationId,
            },
            select: {
               ownerId: true,
            },
         })

         if (!organization) {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: "Organization not found",
            })
         }

         if (organization.ownerId !== ctx.session.userId) {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: "Only organization owner can delete organization",
            })
         }

         await ctx.db.organization.delete({
            where: {
               id: organizationId,
            },
         })

         return "OK"
      }),
   leave: privateProcedure
      .input(leaveOrganizationSchema)
      .mutation(async ({ ctx, input: { organizationId } }) => {
         const organization = await ctx.db.organization.findFirst({
            where: {
               id: organizationId,
            },
            select: {
               ownerId: true,
            },
         })

         if (!organization) {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: "Organization not found",
            })
         }

         if (organization.ownerId === ctx.session.userId) {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: "Organization owner can't leave organization",
            })
         }

         const leftOrganization = await ctx.db.organization.update({
            where: {
               id: organizationId,
            },
            data: {
               members: {
                  disconnect: {
                     id: ctx.session.userId,
                  },
               },
            },
         })

         return leftOrganization.name
      }),
   kick: privateProcedure
      .input(kickOrganizationSchema)
      .mutation(async ({ ctx, input: { organizationId, userIdsToKick } }) => {
         const organization = await ctx.db.organization.findFirst({
            where: {
               id: organizationId,
            },
            select: {
               ownerId: true,
            },
         })

         if (!organization) {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: "Organization not found",
            })
         }

         if (organization.ownerId !== ctx.session.userId) {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: "Only organization owner can kick others out",
            })
         }

         await ctx.db.organization.update({
            where: {
               id: organizationId,
            },
            data: {
               members: {
                  disconnect: userIdsToKick.map((id) => ({ id })),
               },
            },
         })

         return "OK"
      }),
   join: privateProcedure
      .input(acceptOrganizationInvitationSchema)
      .mutation(
         async ({ ctx, input: { invitationId, token, organizationId } }) => {
            const invitation = await ctx.db.organizationInvitation.findFirst({
               where: {
                  id: invitationId,
               },
               select: {
                  invitedUserEmail: true,
                  token: true,
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

async function sendInviteEmail({
   ctx,
   invitedUserEmail,
   organizationName,
   token,
}: {
   ctx: TRPCContext
   invitedUserEmail: string
   organizationName: string
   token: string
}) {
   const res = await ctx.email.emails.send({
      from: "insync. <vasylpolishchuk@vasyldev.cc>",
      to: invitedUserEmail,
      subject: `Invitation to join ${organizationName}`,
      react: OrganizationInviteEmail({
         organizationName,
         sender: ctx.session.user!,
         token,
      }),
   })
   console.log(res)
}

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
