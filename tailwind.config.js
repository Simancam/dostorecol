/** @type {import('tailwindcss').Config} */
import animations from '@midudev/tailwind-animations'

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js"',
  ],
  theme: {
    extend: {},
  },
  plugins: [animations, require('flowbite/plugin')],
}

