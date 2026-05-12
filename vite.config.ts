import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
// import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    // legacy({  // 为了html能直接运行 参考：https://www.cnblogs.com/lingern/p/17789995.html  打包速度降几倍 10秒变三四十秒
    //   targets: ['ie >= 11'],
    //   additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    // }),
  ],
  base: './',
  server: {
    proxy: {
      // 代理 /api 请求到我后端的服务器
      '/api': {
        // target: 'https://yc556.cn', // 目标服务器地址
        target: 'http://127.0.0.1:8080', // 目标服务器地址
        changeOrigin: true, // 允许跨域
        rewrite: (path: string) => path.replace(/^\/api/, ''), // 重写路径，去掉 /api 前缀
      },
      // 代理 /auth 请求到 http://localhost:6000
      '/jfApi': {
        target: 'https://www.jianfast.com',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/jfApi/, ''),
      },
    },
  },
})
