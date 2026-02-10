/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/projeto-mia" : "",
  assetPrefix: isProd ? "/projeto-mia/" : "",
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/projeto-mia" : "",
  },
};

module.exports = nextConfig;
