/** @type {import('next').NextConfig} */
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    domains: ['utfs.io'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Apply polyfills
      config.plugins.push(new NodePolyfillPlugin());
      
      // Add specific fallbacks for node core modules
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:crypto': 'crypto-browserify',
        'node:buffer': 'buffer',
        'node:util': 'util',
        'node:stream': 'stream-browserify',
        'node:process': 'process/browser',
      };
      
      // Add fallbacks
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        util: require.resolve('util'),
        process: require.resolve('process/browser'),
      };
    }
    return config;
  },
};

module.exports = nextConfig;