import {defineConfig} from "vite";
import {viteStaticCopy} from "vite-plugin-static-copy";
import dts from "vite-plugin-dts"
export default defineConfig({
    plugins: [
        dts(),
        viteStaticCopy({
            targets: [
                {
                    src: "src/DrawioViewer.vue",
                    dest: "./",
                },

            ],
        }),
    ],

    build: {
        ssr: true,
        lib: {
            entry: './src/index.ts',
            name: 'index',
            fileName: 'index',
            formats: ["es", "cjs"]
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [
                "minify-xml",
                "vitepress",
                "path",
                "fs",
                "vue",
            ],
            plugins: [],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    "vue": "vue",
                    "path": "path",
                    "fs": "fs"
                },
            },
        },

    },
});
