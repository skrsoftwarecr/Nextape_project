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
  // Paquetes con bindings nativos de Node.js — no bundlear con esbuild.
  // firebase-admin: Admin SDK (usado en route handlers).
  // tree-sitter / tree-sitter-typescript: bindings nativos del GitHub Engine.
  // Ambos son incompatibles con Cloudflare Workers / edge runtime.
  serverExternalPackages: [
    "firebase-admin",
    // Bindings nativos del GitHub Engine. `@kreuzberg/tree-sitter-language-pack` es el que
    // carga de verdad el parser universal (`require` dinámico): si el bundler lo toca, el
    // parser devuelve null en producción y parece un fallo de plataforma.
    "tree-sitter",
    "tree-sitter-typescript",
    "@kreuzberg/tree-sitter-language-pack",
  ],
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
