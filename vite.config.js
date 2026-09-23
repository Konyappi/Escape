import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const APILOGY_BASE_URL =
  'https://bigvision.api.apilogy.id/bigvision-ocr-prod/1.0.0';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = process.env.APILOGY_API_KEY || env.APILOGY_API_KEY;

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/ocr': {
          target: APILOGY_BASE_URL,
          changeOrigin: true,
          secure: true,
          rewrite: () => '/analytics/ocr/image-to-text',
          configure(proxy) {
            proxy.on('proxyReq', (proxyRequest) => {
              if (apiKey) {
                proxyRequest.setHeader('X-API-KEY', apiKey);
              }
            });

            proxy.on('proxyRes', (proxyResponse) => {
              console.log(`[OCR proxy] Apilogy HTTP ${proxyResponse.statusCode}`);
            });
          },
        },
      },
    },
  };
});
