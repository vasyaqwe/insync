import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import "@total-typescript/ts-reset"
import { type User as ClerkUserType } from "@clerk/nextjs/server"
import { type User as DbUserType } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function pick<T extends object, K extends keyof T>(
   obj: T,
   keys: K[]
): Pick<T, K> {
   return keys.reduce(
      (acc, key) => {
         if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
            acc[key] = obj[key]
         }
         return acc
      },
      {} as Pick<T, K>
   )
}

export function isEmail(email: string) {
   return String(email)
      .toLowerCase()
      .match(
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
}

export function focusContentEditableElement(
   contentEditableElement: HTMLElement | null
) {
   if (!contentEditableElement) return

   contentEditableElement?.focus()
   const range = document.createRange() //Create a range (a range is a like the selection but invisible)
   range.selectNodeContents(contentEditableElement) //Select the entire contents of the element with the range
   range.collapse(false) //collapse the range to the end point. false means collapse to end rather than the start

   const selection = window.getSelection() //get the selection object (allows you to change selection)
   selection?.removeAllRanges() //remove any selections already made
   selection?.addRange(range) //make the range you have just created the visible selection
}

export function getUploadthingFileIdsFromHTML(html: string | null) {
   if (!html || typeof window === "undefined") return []

   const parser = new DOMParser()
   const doc = parser.parseFromString(html, "text/html")

   const ids = [...doc.querySelectorAll("img")]
      .map((img) => getUploadThingFileIdFromUrl(img.getAttribute("src")))
      .filter(Boolean)

   return ids
}

export function getUploadThingFileIdFromUrl(url: string | undefined | null) {
   return url?.split("/f/")[1]
}

export function isDateToday(dateInput: Date) {
   const date = new Date(dateInput)

   const now = new Date()
   const yesterday = new Date(now)

   yesterday.setDate(now.getDate() - 1)

   const beforeYesterday = new Date(now)
   beforeYesterday.setDate(now.getDate() - 2)

   if (date.toDateString() === now.toDateString()) {
      return true
   }
   return false
}

export async function convertImageToBase64(
   url: string
): Promise<string | null> {
   try {
      const response = await fetch(url)
      if (!response.ok) {
         throw new Error("Network response was not ok")
      }
      const blob = await response.blob()

      return new Promise((resolve, reject) => {
         const reader = new FileReader()
         reader.onloadend = () => {
            const base64data = reader.result
            resolve(base64data as string)
         }
         reader.onerror = reject
         reader.readAsDataURL(blob)
      })
   } catch (error) {
      console.error("Error in converting image to base64:", error)
      return null
   }
}

export function convertClerkUserToDbUser(user: ClerkUserType): DbUserType {
   return {
      email: user.emailAddresses[0]?.emailAddress ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      imageUrl: user.imageUrl,
      id: user.id,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.createdAt),
   }
}
