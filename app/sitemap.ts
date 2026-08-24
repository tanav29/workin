import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cowork.vercel.app";
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/nearby`, lastModified: new Date() },
    { url: `${base}/settings`, lastModified: new Date() },
  ];
}
