import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  async redirects() {
    return [
      {
        source: "/resume",
        destination: "/resume/Odon-Ineza-Resume.pdf",
        permanent: false
      }
    ];
  }
};

export default nextConfig;
