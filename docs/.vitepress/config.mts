import { defineConfig } from 'vitepress'
import withDrawio from '../../src/index'
// https://vitepress.dev/reference/site-config
export default withDrawio(defineConfig({
  title: "Vite Press Drawio",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [

        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
}), {
    resize: true,
    pages: true,
    zoom: true,
    layers: true,
    lightbox: true,
    tags: true,
    transparent: true,
    highlight: '#0000FF',
    darkMode: 'auto',
    edit: '_blank'
})
