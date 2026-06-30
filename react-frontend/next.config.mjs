/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8080/api/:path*',
      },
      {
        source: '/ws/:path*',
        destination: 'http://127.0.0.1:8080/ws/:path*',
      },
    ];
  },
};

export default nextConfig;
