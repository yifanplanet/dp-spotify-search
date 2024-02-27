/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // remotePatterns: ['i.scdn.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
      },
    ],
  },
};

export default nextConfig;
