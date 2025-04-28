import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.HOST_IP || '0.0.0.0',
    port: 5173,
  },
  preview:{
    allowedHosts: ['https://student-client.onrender.com/'] 
  }
})
