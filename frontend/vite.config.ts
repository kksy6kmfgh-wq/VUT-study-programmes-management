import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: https://kksy6kmfgh-wq.github.io/VUT-study-programmes-management/
export default defineConfig({
  plugins: [react()],
  base: '/VUT-study-programmes-management/',
})
