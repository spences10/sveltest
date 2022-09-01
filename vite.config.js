import { sveltekit } from '@sveltejs/kit/vite'
import { resolve } from 'path'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  test: {
    globals: true,
    environment: `jsdom`,
  },
  resolve: {
    alias: {
      $src: resolve(`./src`),
    },
  },
}

export default config
