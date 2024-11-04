/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        // NEXT_PUBLIC_KEYS_SERVER: "https://key.runlite.app",
        NEXT_PUBLIC_KEYS_SERVER: "http://localhost/keys",
        NEXT_PUBLIC_COMPILER_SERVER:"http://localhost/compiler",
        // NEXT_PUBLIC_COMPILER_SERVER: "https://api.runlite.app",
        NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyC6Sez5TwdHDKODPjuSmJT4UM0EiEQK4LA",
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "compyl-41982.firebaseapp.com",
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: "compyl-41982",
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "compyl-41982.appspot.com",
        NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID: "908187373839",
        NEXT_PUBLIC_FIREBASE_APP_ID: "1:908187373839:web:9bde47199a7914bcac6e7a",
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-716PJKZ1JM",
        NEXT_PUBLIC_SALT_KEY:
          "e8907ce6f646a336bd54a706c32d32a812558e138e9ed44cdc26868db7373c3d",
        NEXT_PUBLIC_API_KEY:
          "ak_bbc4b91f7737882dc41e5a25de3d07c4f1d5e81937171df7e402e700d6695908",
      },
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
