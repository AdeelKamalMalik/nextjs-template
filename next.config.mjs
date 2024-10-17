import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NEXT_IMAGE_ALLOWED_DOMAINS = [
  (process.env.NEXT_PUBLIC_API_URL || '').replace(/^https?:\/\//, ""),
  "localhost",
  "dummyimage.com",
  "i.pravatar.cc",
  "res.cloudinary.com"
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles'),
      path.join(__dirname, 'pages'),
      path.join(__dirname, 'src')
    ],
  },
  images: {
    domains: NEXT_IMAGE_ALLOWED_DOMAINS,
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
