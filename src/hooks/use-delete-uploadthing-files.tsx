import { api } from "@/trpc/react"
import { useState } from "react"

export function useDeleteUploadthingFiles() {
   const [fileIdsToDeleteFromStorage, setFileIdsToDeleteFromStorage] = useState<
      string[]
   >([])

   const { mutate: onDeleteFiles } = api.uploadthing.deleteFiles.useMutation({
      onSettled: () => {
         setFileIdsToDeleteFromStorage([])
      },
   })

   return {
      fileIdsToDeleteFromStorage,
      setFileIdsToDeleteFromStorage,
      onDeleteFiles,
   }
}
