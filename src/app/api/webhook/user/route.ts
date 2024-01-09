import { db } from "@/server/db"
import { type IncomingHttpHeaders } from "http"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Webhook, type WebhookRequiredHeaders } from "svix"

const webhookSecret = process.env.WEBHOOK_SECRET ?? ""

async function handler(request: Request) {
   const payload = await request.json()
   const headersList = headers()
   const heads = {
      "svix-id": headersList.get("svix-id"),
      "svix-timestamp": headersList.get("svix-timestamp"),
      "svix-signature": headersList.get("svix-signature"),
   }
   const wh = new Webhook(webhookSecret)
   let evt: Event | null = null

   try {
      evt = wh.verify(
         JSON.stringify(payload),
         heads as IncomingHttpHeaders & WebhookRequiredHeaders
      ) as Event
   } catch (err) {
      console.error((err as Error).message)
      return NextResponse.json({}, { status: 400 })
   }

   const eventType: EventType = evt.type
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const { id, ...attributes } = evt.data as any

   if (eventType === "user.created" || eventType === "user.updated") {
      await db.user.upsert({
         where: { id: id as string },
         create: {
            id: id as string,
            firstName: attributes.first_name as string,
            lastName: attributes.last_name as string,
            email: attributes?.email_addresses?.[0]?.email_address as string,
            imageUrl: attributes.image_url,
            createdAt: new Date(attributes.created_at),
            updatedAt: new Date(attributes.updated_at),
         },
         update: {
            firstName: attributes.first_name as string,
            lastName: attributes.last_name as string,
            email: attributes?.email_addresses?.[0]?.email_address as string,
            imageUrl: attributes.image_url,
         },
      })
   } else if (eventType === "user.deleted") {
      await db.user.delete({
         where: { id: id as string },
      })
   }

   return new NextResponse("OK")
}

type EventType = "user.created" | "user.updated" | "user.deleted" | "*"

type Event = {
   data: Record<string, string | number>
   object: "event"
   type: EventType
}

export const GET = handler
export const POST = handler
export const PUT = handler
