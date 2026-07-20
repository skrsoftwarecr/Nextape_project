import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Los errores de TypeScript ahora BLOQUEAN el build. El typecheck del proyecto está
  // limpio (`npm run typecheck`); no se deben volver a ignorar los errores de tipos.
  // ESLint SÍ está configurado (eslint.config.mjs) y lo aplica CI (`npm run lint`) de forma
  // independiente; se evita la integración de ESLint dentro de `next build` a propósito.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // firebase-admin es un paquete de Node (solo se usa en route handlers). No debe empaquetarse.
  serverExternalPackages: ["firebase-admin"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
