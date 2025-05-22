// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';


export default defineConfig({
 server: {
   allowedHosts: ['myfe.serveo.net', 'localhost'],
   proxy: {
     '/api': {
       target: 'https://kiemtra.serveo.net',
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


