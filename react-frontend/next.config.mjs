/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivityPosition: 'bottom-right',
    buildActivity: false,
    appIsrStatus: false,
  },
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
