import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cardPlugin from "./scripts/generateCards";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), cardPlugin()],
    server: {
        port: 3001,
        proxy: {
            "/api": {
                target: "http://localhost:3000",
            },
        },
    },
});
