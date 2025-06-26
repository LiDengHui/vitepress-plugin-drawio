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
}))
