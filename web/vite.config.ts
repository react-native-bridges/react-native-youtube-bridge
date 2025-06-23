import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      '@react-native-youtube-bridge/web': path.resolve(__dirname, '../packages/web/src/index.ts'),
      '@react-native-youtube-bridge/core': path.resolve(__dirname, '../packages/core/src/index.ts'),
      '@react-native-youtube-bridge/react': path.resolve(__dirname, '../packages/react/src/index.ts'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  }
})
