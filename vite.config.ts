import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: './',
  server: {
    proxy: {
      // 代理 /api 请求到我后端的服务器
      '/api': {
        target: 'https://yc556.cn', // 目标服务器地址
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
