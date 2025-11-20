/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for better Firebase Hosting compatibility
  trailingSlash: true,
};

module.exports = nextConfig;
