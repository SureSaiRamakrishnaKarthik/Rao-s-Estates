/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bsgebdvyyqfetczorjjh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'sribhramara.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
