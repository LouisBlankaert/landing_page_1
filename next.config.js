/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Désactiver l'analyse ESLint pendant le build
  eslint: {
    // Avertissement au lieu d'erreur
    ignoreDuringBuilds: true,
  },
  // Désactiver la vérification des types TypeScript pendant le build
  typescript: {
    // Avertissement au lieu d'erreur
    ignoreBuildErrors: true,
  },
  // Configuration des images
  images: {
    domains: ['images.unsplash.com', 'player.vimeo.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'player.vimeo.com',
      },
    ],
  },
  // Augmenter la mémoire disponible pour les routes API
  serverRuntimeConfig: {
    // Augmenter les limites pour les routes API
    api: {
      bodyParser: {
        sizeLimit: '1mb',
      },
      responseLimit: '4mb',
    },
  },
};

module.exports = nextConfig;
