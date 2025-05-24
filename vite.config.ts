// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { env } from 'process';


export default defineConfig({
 server: {
   allowedHosts: ['tend-gratuit-may-controller.trycloudflare.com', 'localhost'],
   proxy: {
     '/api': {
       target: env.VITE_API_BASE_URL,
       changeOrigin: true,
       secure: false,
     },
   },
   host: true,
   port: 3000,
   strictPort: true,
 },


 plugins: [react(), tailwindcss()],
 resolve: {
   alias: {
     '@': path.resolve(__dirname, './src'),
   },
 },
 });


