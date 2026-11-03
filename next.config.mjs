/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep `next build` from replacing the manifests used by a running dev server.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  // no rewrites to the backend: the Express API stays a separate service
  // and is called directly over REST (see lib/api.js)
};

export default nextConfig;
