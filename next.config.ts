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
      },
      {
        source: "/projects/ndpeeps_cs_internships",
        destination: "/projects/cicd-internship-page",
        permanent: true
      },
      {
        source: "/projects/ndpeeps_ee_internships",
        destination: "/projects/cicd-internship-page",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
