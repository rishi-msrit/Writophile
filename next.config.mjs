/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    // Static export requires unoptimized images
    unoptimized: true,
  },
};

export default nextConfig;
