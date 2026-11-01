import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // /qr nås bara via direktlänk. Sidan har egen noindex, men PDF- och SVG-filerna behöver rubriken.
  async headers() {
    return [
      {
        source: "/qr/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
