import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "https://davida-unsulphureous-shirly.ngrok-free.dev",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],

};

export default nextConfig;
