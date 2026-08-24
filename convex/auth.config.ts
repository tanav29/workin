import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain:
        process.env.CLERK_JWT_ISSUER_DOMAIN ??
        process.env.CLERK_FRONTEND_API_URL ??
        "https://sound-urchin-6968.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;