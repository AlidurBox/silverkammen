import type { MetadataRoute } from "next";
import { business } from "@/data/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${business.name} – Barbershop i Söderköping`,
    short_name: business.name,
    description: business.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9f6",
    theme_color: "#fbf9f6",
    lang: "sv",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
