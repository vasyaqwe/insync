import { auth } from "@clerk/nextjs"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
   imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
      .middleware(async () => {
         const session = auth()

         // If you throw, the user will not be able to upload
         if (!session.userId) throw new Error("Unauthorized")

         return { userId: session.userId }
      })
      .onUploadComplete(async () => {
         // console.log("Upload complete for userId:", metadata.userId)
         // console.log("file url", file.url)
      }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
