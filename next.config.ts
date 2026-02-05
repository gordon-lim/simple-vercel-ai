import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable symlinks for both Turbopack and webpack
    externalDir: true,
  },

  serverExternalPackages: [
    'raindrop-ai',
    '@traceloop/node-server-sdk',
    'fsevents',
    'chokidar',
    'nunjucks',
  ],

  // Webpack config for symlink resolution and native modules
  webpack: (config, { isServer }) => {
    config.resolve.symlinks = true;

    if (isServer) {
      // Mark .node files as external assets
      config.externals.push({
        'fsevents': 'commonjs fsevents',
      });

      config.module.rules.push({
        test: /\.node$/,
        use: 'asset/resource',
      });
    }

    return config;
  },
};

export default nextConfig;
