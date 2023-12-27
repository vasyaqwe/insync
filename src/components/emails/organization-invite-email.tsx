import React from "react"
import {
   Html,
   Body,
   Head,
   Heading,
   Img,
   Container,
   Preview,
   Section,
   Text,
   Button,
} from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"
import { type User } from "@prisma/client"
import { primaryColor } from "@/config"

type OrganizationInviteEmailProps = {
   sender: User
   organizationName: string
   token: string
}

export function OrganizationInviteEmail({
   sender,
   organizationName,
   token,
}: OrganizationInviteEmailProps) {
   const baseUrl =
      process.env.NODE_ENV === "production"
         ? `https://insync-ai.vercel.app`
         : "http://localhost:3000"

   return (
      <Html>
         <Head />
         <Preview>You are invited to an organization in insync</Preview>
         <Tailwind>
            <Body
               style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
               className="text-black"
            >
               <Container className="max-w-[600px] px-10 py-4">
                  <Img
                     src={`https://www.dl.dropboxusercontent.com/scl/fi/s1f3b58vt74yd1ykqlsts/logo.png?rlkey=e7johbj3n2kxmvs528bc484h1&dl=0`}
                     alt="insync."
                  />
                  <Section className="my-10">
                     <Heading className="text-3xl text-black">
                        Join an organization on insync
                     </Heading>
                     {sender.imageUrl && (
                        <Img
                           width={50}
                           height={50}
                           className="h-[50px] w-[50px] flex-shrink-0 rounded-full "
                           src={sender.imageUrl}
                           alt={sender.firstName}
                        />
                     )}
                     <Text>
                        <b>
                           {sender.firstName} {sender.lastName}
                        </b>{" "}
                        ({sender.email}) has invited you work together in an
                        organization called <b>{organizationName}</b>.
                     </Text>
                     <Button
                        target="_blank"
                        className="mt-4 rounded-lg px-6 py-4 text-sm text-white"
                        href={`${baseUrl}/invite/${token}`}
                        style={{ backgroundColor: primaryColor }}
                     >
                        Accept invitation
                     </Button>
                  </Section>
               </Container>
            </Body>
         </Tailwind>
      </Html>
   )
}
