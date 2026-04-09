import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
// nextintl libreria de internalizacion para cambiar idioma
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.pinimg.com"}
    ]
  }
  
  /* config options here */
};

export default withNextIntl(nextConfig);
