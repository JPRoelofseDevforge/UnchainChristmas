/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed deprecated appDir option - Next.js 14+ uses app directory by default
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig