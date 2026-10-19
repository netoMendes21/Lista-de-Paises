import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com", pathname: "/*.svg", search: "" },
    ],
  },
};

export default nextConfig;
