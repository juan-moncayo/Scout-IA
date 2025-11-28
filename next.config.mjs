/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.d-id.com',
      },
      {
        protocol: 'https',
        hostname: 'create-images-results.d-id.com',
      },
    ],
  },
  // Permitir recursos externos de D-ID
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://agent.d-id.com",
          },
        ],
      },
    ]
  },
}

export default nextConfig