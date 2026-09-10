import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/shared/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/app", "/api/"] },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
