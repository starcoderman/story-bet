/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: [],
  },
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/auth/register",
        permanent: true,
      },
    ];
  },
  
};

module.exports = nextConfig;
