/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs")

import withNextIntl from "next-intl/plugin"
const withNextIntlInstance = withNextIntl()

/** @type {import("next").NextConfig} */
const config = withNextIntlInstance({
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "img.clerk.com",
            port: "",
         },
         {
            protocol: "https",
            hostname: "images.clerk.dev",
            port: "",
         },
         {
            protocol: "https",
            hostname: "www.gravatar.com",
            port: "",
         },
      ],
   },
})

export default config
