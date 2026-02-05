/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/projeto-mia",
  assetPrefix: "/projeto-mia/",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/projeto-mia",
  },
};

module.exports = nextConfig;
