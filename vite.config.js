import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Cấu hình Vitest — chạy test bằng `npm test`.
  test: {
    environment: 'jsdom',       // giả lập DOM trong Node để test component React
    setupFiles: './src/test/setup.js',
  },
})
