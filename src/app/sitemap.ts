import type { MetadataRoute } from "next";
import academies from "@/data/academies.json";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://localedu.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,        lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/explore`, lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/saved`,   lastModified: now, changeFrequency: "weekly",  priority: 0.5 },
    { url: `${SITE_URL}/me`,      lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const academyRoutes: MetadataRoute.Sitemap = (academies as { id: string }[]).map(
    (a) => ({
      url: `${SITE_URL}/academy/${a.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  return [...staticRoutes, ...academyRoutes];
}
