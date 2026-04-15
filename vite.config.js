import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  test: {
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
})