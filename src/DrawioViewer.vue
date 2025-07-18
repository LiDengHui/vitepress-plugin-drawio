<template>

  <div class="mxgraph" :data-mxgraph="data" :style="style"></div>
</template>
<script setup>
import {watch, computed, useSlots} from 'vue'

const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '600px'
  },
  page: {
    type: String,
    default: '0'
  },
  title: {
    type: String,
    default: ''
  },
  edit: {
    type: String,
  },
  darkMode: {
    type: String,
  },
  pages: {
    type: Boolean,
    default: false
  },
  zoom: {
    type: Boolean,
    default: false
  },
  layers: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: Boolean,
    default: false,
  },
  lightbox: {
    type: Boolean,
    default: false,
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  resize: {
    type: Boolean,
    default: false,
  },
  nav: {
    type: Boolean,
    default: false,
  },
  highlight: {
    type: String,
    default: false,
  },

})


const slots = useSlots();


const data = computed(() => {
  const a = slots.default().at(0);
  const url = a?.props?.src;
  if (!url) return;

  const {pages, zoom, layers, tags, lightbox, page, title, darkMode} = props;

  const toolbar = Object.entries({
    pages,
    zoom,
    layers,
    tags,
    lightbox
  }).reduce((acc, [key, value]) => {
    return acc + (value ? `${key} ` : "")
  }, '').trim();

  const data = {
    page,
    title,
    url,
  };

  ['edit', 'highlight', 'transparent', 'nav', 'resize'].forEach(key => {
    if (!!props[key]) {
      data[key] = props[key];
    }
  })

  if (darkMode) {
    data["dark-mode"] = darkMode;
  }
  if (toolbar) {
    data.toolbar = toolbar;
  }

  return JSON.stringify(data);
});

const style = computed(() => {

  return {
    width: props.width,
    height: props.height,
    display: "block",
    margin: "auto",
    overflow: "hidden",
    maxWidth: "100%",
    border: "1px solid transparent"
  }
})


function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
}

const fn = debounce(() => {
  if (window.Editor) {
    window.Editor.initMath();
    if (null != window.onDrawioViewerLoad) window.onDrawioViewerLoad(); else window.GraphViewer.processElements()
  }
}, 0)

watch(() => [data, style], async () => {
  fn();
}, {
  immediate: true,
})
</script>
<style scoped>

</style>
