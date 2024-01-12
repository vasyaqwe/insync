export const metadataConfig = {
   title: "insync.",
   description:
      "insync is a Next.js 14 & TRPC app for organizing workspaces for teams.",
   icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export const primaryColor = "#4d80ef"

export const MOBILE_BREAKPOINT = 768

export const actionLookup = {
   CREATE: "created",
   UPDATE: "updated",
   MOVE: "moved",
   DELETE: "deleted",
} as const

export const entityTypeLookup = {
   BOARD: "board",
   LIST: "list",
   CARD: "card",
} as const
