import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['@remixicon/react',],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "downloads.ctfassets.net" },
    ],
    deviceSizes: [390, 768, 1280, 1920],
  },
};

export default nextConfig;
