import { Pinecone } from "@pinecone-database/pinecone"

const apiKey = process.env.PINECONE_API_KEY!

const pinecone = new Pinecone({
   apiKey,
})

export const pineconeIndex = pinecone.Index("insync-ai-app")
