import {type  UserConfig} from "vitepress";
import * as path from "path";
import * as fs from "fs";

declare module "vitepress" {
    interface UserConfig {

    }
}

interface DrawioConfig {
    // set default width， default： 100%
    pageWidth?: string;
    // set default height，default： 600px
    pageHeight?: string;
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
    transparent?: 0 | 1;
    highlight?: string;
}


const withDrawio = (config: UserConfig, drawioConfig: DrawioConfig = {}) => {

    if (!config.markdown) config.markdown = {};
    if (!config.vite) config.vite = {};
    if (!config.markdown.config) config.markdown.config = () => {
    };

    const _config = config.markdown.config;

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
    config.markdown.config = (md) => {
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
            const dir = path.dirname(env.path);
            const ext = path.extname(src);

            if (ext === '.drawio') {
                // 替换为新的后缀
                const filename = path.basename(src, ext);
                const contents = fs.readFileSync(path.join(dir, src), 'utf-8').toString();
                const pageWidth = drawioConfig.pageWidth;
                const pageHeight = drawioConfig.pageHeight;


                const height = token.attrGet('height') ?? pageWidth ?? "600px";
                const width = token.attrGet('width') ?? pageHeight ?? "100%";
                const title = filename;
                const highlight = token.attrGet("highlight") ?? drawioConfig.highlight;
                const page = token.attrGet("page") ?? drawioConfig.page ?? 0;
                const edit = token.attrGet("edit") ?? drawioConfig.edit;
                const darkMode = token.attrGet("darkMode") ?? drawioConfig["darkMode"] ?? 'auto';
                const pages = token.attrGet("pages") ?? drawioConfig.pages;
                const zoom = token.attrGet("zoom") ?? drawioConfig.zoom;
                const layers = token.attrGet("layers") ?? drawioConfig.layers;
                const tags = token.attrGet("tags") ?? drawioConfig.tags;
                const lightbox = token.attrGet("lightbox") ?? drawioConfig.lightbox;

                const toolbar = [
                    pages,
                    zoom,
                    layers,
                    tags,
                    lightbox,
                ].filter(Boolean).join(' ');

                const data: Record<string, any> = {
                    highlight,
                    page,
                    title,
                    edit,
                    "dark-mode": darkMode,
                    transparent: true,
                    nav: true,
                    resize: false,
                    xml: contents,
                    toolbar: undefined,
                }

                if (toolbar.trim().length !== 0) {
                    data.toolbar = toolbar;
                }

                return `
                <span class="mxgraph" data-mxgraph='${JSON.stringify(data)}' style="width:${width};height:${height};display: block; margin:auto; border: 1px solid transparent"></span>
                
                `

            } else {
                return result;
            }

        }

    }

    return config;
}

export default withDrawio;
