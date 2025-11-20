/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build/web',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
