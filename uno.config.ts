import presetWebFonts from '@unocss/preset-web-fonts'
import presetWind3 from '@unocss/preset-wind3'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetWebFonts({
      provider: 'bunny',
      fonts: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      }
    }),
  ],
  shortcuts: {
    'btn': 'px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700',
  }
})
