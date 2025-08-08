// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'generativelanguage.googleapis.com',
      },
      // Add this new entry for the placeholder service
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Add this entry for your Supabase Storage
      {
        protocol: 'https',
        hostname: 'kfjzndaiavottdbxvwex.supabase.co',
      },
    ],
  },
};

export default nextConfig;