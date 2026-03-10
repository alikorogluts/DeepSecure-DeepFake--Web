/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eswltcxhrldqzzekrnfm.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*', 
        
        // 👇 DEĞİŞİKLİK BURADA: /api/v1 kısmını sildik, sadece URL ve path kaldı
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`, 
      },
    ];
  },
};

export default nextConfig;

/*

todo : burda maskeleme yaptık safari tarafı hata almasın diye  eski hali eğer domain alınırsa kullanılacak kod budur.(/lib/axios.ts dosyasındada değişiklik yapman gerekiyor)
@type {import('next').NextConfig} 
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eswltcxhrldqzzekrnfm.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig; */ 