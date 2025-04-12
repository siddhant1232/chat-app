import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from "path";
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    // Removed invalid 'path' property
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            '@pages': path.resolve(__dirname, 'src/pages')
        },
    },
});
