import type { MetadataRoute } from "next";

const siteUrl = "https://eduvora-nu.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/assessment/",
        "/dashboard/",
        "/colleges/nearby",
        "/courses/compare",
        "/login",
        "/register",
        "/forgot-password",
        "/verify-otp",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
