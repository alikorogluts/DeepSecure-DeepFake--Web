/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eswltcxhrldqzzekrnfm.supabase.co', // Senin Supabase host adın
        port: '',
        pathname: '/storage/v1/object/public/**', // Tüm public klasörlerine izin veriyoruz
      },
    ],
  },
};

export default nextConfig;