/** @type {import('next').NextConfig} */
const nextConfig = {

      async redirects() {
        return [
          {
            source: '/',
            destination: '/playground',
            permanent: true, 
          },
        ];
      },
    
};

export default nextConfig;
