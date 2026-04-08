import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.pinimg.com"}
    ]
  }
  
  /* config options here */
};

export default nextConfig;
