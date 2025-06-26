import {defineConfig} from "vite";
import dts from "vite-plugin-dts";



export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'index',
            fileName: 'index',
        },

        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [
                "vitepress",
                "path",
                "fs"
            ],
        }
    },

    plugins: [dts()],


});
