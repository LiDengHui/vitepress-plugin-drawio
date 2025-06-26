import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@dhlx/vitepress-plugin-drawio/DrawioViewer.vue": path.join(
                __dirname,
                "../dist/DrawioViewer.vue"
            ),
        },
    },
    server: {
        fs: {
            allow: ["../../"],
        },
    },
});
