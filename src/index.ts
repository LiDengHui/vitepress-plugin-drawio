import {type  UserConfig} from "vitepress";
import * as path from "path";
import {drawioPlugin} from "./plugin.ts";

declare module "vitepress" {
    interface UserConfig {

    }
}


interface DrawioConfig {
    // set default width， default： 100%
    width?: string;
    // set default height，default： 600px
    height?: string;
    // start page 0
    page?: number;
    // set page title
    title?: string;
    // editable mode，default： _blank
    edit?: "_blank";
    // dark mode，default： auto
    darkMode?: "light" | "dark" | "auto";

    // enable toolbar resize，default： false
    resize?: boolean;

    // enable toolbar change pages，default： false
    pages?: boolean;
    // enable toolbar zoom，default： false
    zoom?: boolean;

    // enable toolbar layers，default： false
    layers?: boolean;

    // enable toolbar lightbox，default： false
    lightbox?: boolean;

    // enable toolbar tags，default： false
    tags?: boolean;

    // enable transparent，default： false
    transparent?: boolean;

    // set highlight color，default： #0000FF
    highlight?: string;
}


const withDrawio = (config: UserConfig, drawioConfig: DrawioConfig = {}) => {

    if (!config.markdown) config.markdown = {};
    if (!config.vite) config.vite = {};
    if (!config.markdown.config) config.markdown.config = () => {
    };
    if (!config.vite.plugins) config.vite.plugins = [];
    config.vite.plugins.push(drawioPlugin());

    config.head = config.head || [];
    config.head.push([
        'script',
        {
            type: 'text/javascript',
            src: 'https://viewer.diagrams.net/js/viewer-static.min.js'
        }
    ], [
        'style',
        {
            type: 'text/css',

        },
        // vitepress change the img style to display: block; margin: auto;
        // because of the style is inline, so we need to use the title attribute to select the style
        `
        span[title] > img {
           display: inline;
        }
        `
    ])
    const assetsInclude = config.vite.assetsInclude || [];
    config.vite.assetsInclude = [
        ...(Array.isArray(assetsInclude) ? assetsInclude : [assetsInclude]),
        '**/*.drawio'
    ]
    const _config = config.markdown.config;

    config.markdown.config = function (md) {
        _config(md);

        const _image = md.renderer.rules.image;
        if (!_image) return;


        md.renderer.rules.image = (tokens, idx, options, env, self) => {

            if (!_image) return _image;

            const token = tokens[idx];
            const result = _image(tokens, idx, options, env, self);
            const src = token.attrGet('src');

            if (!src) return result;
            // 找到文件后缀
            const ext = path.extname(src);

            if (ext === '.drawio') {
                // 替换为新的后缀
                const filename = path.basename(src, ext);
                const pageWidth = drawioConfig.width;
                const pageHeight = drawioConfig.height;

                const height = token.attrGet('height') ?? pageHeight ?? "600px";
                const width = token.attrGet('width') ?? pageWidth ?? "100%";

                const title = token.attrGet("alt")??filename;
                const highlight = token.attrGet("highlight") ?? drawioConfig.highlight ?? "";
                const page = token.attrGet("page") ?? drawioConfig.page ?? 0;
                const edit = token.attrGet("edit") ?? drawioConfig.edit ?? '';
                const darkMode = token.attrGet("darkMode") ?? drawioConfig["darkMode"] ?? '';
                const pages = token.attrGet("pages") ?? drawioConfig.pages ?? false;
                const zoom = token.attrGet("zoom") ?? drawioConfig.zoom ?? false;
                const layers = token.attrGet("layers") ?? drawioConfig.layers ?? false;
                const tags = token.attrGet("tags") ?? drawioConfig.tags ?? false;
                const lightbox = token.attrGet("lightbox") ?? drawioConfig.lightbox ?? false;
                const resize = token.attrGet("resize") ?? drawioConfig.resize ?? false;

                const transparent = token.attrGet("transparent") ?? drawioConfig.transparent ?? false;

                return `
                    <ClientOnly>
                         <DrawioViewer
                            page = "${page}"
                            title = "${title}"
                            edit = "${edit}"
                            dark-mode = "${darkMode}"
                            ${pages ? "pages" : ""}
                            ${zoom ? "zoom" : ""}
                            ${layers ? "layers" : ""}
                            ${tags ? "tags" : ""}
                            ${lightbox ? "lightbox" : ""}
                            highlight="${highlight}"
                            ${transparent ? "transparent" : ""}
                            ${true ? "nav" : ""}
                            ${resize ? "resize" : ""}
                            height="${height}"
                            width="${width}" >
                             <img src="${src}" alt="">
                         </DrawioViewer>
                    </ClientOnly>
                `
            }

            return result;

        }

    }

    return config;
}

export default withDrawio;
