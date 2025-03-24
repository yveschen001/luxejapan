/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // 用于生产环境部署
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/7.x/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
    domains: ['api.dicebear.com', 'localhost'], // 允许的图片域名
  },
  // 生产环境的基础路径，如果部署在子目录则需要配置
  // basePath: '/telesoul',
  // 是否允许在生产环境中导出源码映射
  productionBrowserSourceMaps: false,
  // 优化构建输出
  swcMinify: true,
  // 配置 webpack
  webpack: (config, { isServer }) => {
    // 自定义 webpack 配置
    return config
  },
}

module.exports = nextConfig 