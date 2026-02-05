/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/projeto-mia",
  assetPrefix: "/projeto-mia/",
};

module.exports = nextConfig;
