import type { NextConfig } from "next";

const dkdNextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default dkdNextConfig;
