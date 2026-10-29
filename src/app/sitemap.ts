import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const routes: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/boka", priority: 0.9 },
  { path: "/tjanster", priority: 0.9 },
  { path: "/om-oss", priority: 0.6 },
  { path: "/galleri", priority: 0.6 },
  { path: "/kontakt", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
