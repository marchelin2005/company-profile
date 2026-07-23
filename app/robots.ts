import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/", // Melindungi halaman admin agar tidak masuk pencarian Google
    },
    sitemap: "https://nexacorp.id/sitemap.xml",
  };
}