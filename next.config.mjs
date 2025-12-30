import { execSync } from "child_process";
// lbm fixing kesenggol next config
const commitHash = execSync('git log --pretty=format:"%h" -n1')
  .toString()
  .trim();

const nextConfig = {
  assetPrefix: '/muatparts',
  reactStrictMode: false,
  env: {
    COMMIT_HASH: commitHash,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_ASSET_REVERSE + "/"],
    path: process.env.NEXT_PUBLIC_ASSET_REVERSE + "/_next/image",
    remotePatterns: [
      {
        hostname: "prd.place",
      },
      {
        hostname: "buyer-az.assetlogistik.com",
      },
      {
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        hostname: "placehold.co",
      },
      {
        hostname: "img.youtube.com",
      },
      {
        hostname: "www.youtube.com",
      },
      {
        hostname: "youtube.com",
      },
      {
        hostname: process.env.NEXT_PUBLIC_URL_S3_IMAGE
      },
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "images.tokopedia.net",
      },
      {
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;