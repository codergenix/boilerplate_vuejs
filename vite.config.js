import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import sass from 'sass';

// import vueDevTools from 'vite-plugin-vue-devtools'
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3062,
    watch: {
      usePolling: true
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3062,
    watch: {
      usePolling: true
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
        api: 'modern-compiler'
      },
    },
  },
  build: {
    sourcemap: true,
    commonjsOptions: { transformMixedEsModules: true },
    external: ['devextreme', 'devextreme-vue'],
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.message.includes('sourcemap')) {
          return;
        }
        warn(warning);
      },
    }
  }
});
