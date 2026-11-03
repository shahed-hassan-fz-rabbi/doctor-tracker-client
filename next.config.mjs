/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // no rewrites to the backend: the Express API stays a separate service
  // and is called directly over REST (see lib/api.js)
};

export default nextConfig;
