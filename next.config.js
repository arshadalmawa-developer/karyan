/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    }
    
    // Disable source maps in development to prevent 404 errors
    config.devtool = false;
    
    return config
  },
  // Disable source maps completely
  productionBrowserSourceMaps: false,
  developmentBrowserSourceMaps: false,
  // Additional source map settings
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
