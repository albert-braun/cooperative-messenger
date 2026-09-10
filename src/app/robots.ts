import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/shared/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/app", "/api/"] },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
