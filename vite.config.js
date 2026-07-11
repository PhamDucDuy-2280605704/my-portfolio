import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Cấu hình Vitest — chạy test bằng `npm test`.
  test: {
    environment: 'jsdom',       // giả lập DOM trong Node để test component React
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Không tính coverage cho code không thực sự có logic để test
      // (data tĩnh, file cấu hình, main.jsx chỉ gọi render...).
      exclude: [
        'src/data/**',
        'src/main.jsx',
        'src/test/**',
        '**/*.config.js',
        '**/*.css',
        'src/assets/**',
        'dist/**',
      ],
    },
  },
})
