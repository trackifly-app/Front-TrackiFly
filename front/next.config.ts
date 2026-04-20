import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
// nextintl libreria de internalizacion para cambiar idioma
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { 
        protocol: "https",
        hostname: "i.pinimg.com"},
      {
      protocol: "https",
      hostname: "www.google.com",
    },
    ],
    qualities: [75, 100]
  }
  /* config options here */
};

export default withNextIntl(nextConfig);
