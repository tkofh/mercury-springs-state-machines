const tailwindColors = require('tailwindcss/colors')
const color = require('@k-vyn/coloralgorithm')
const config = {
  properties: {
    steps: 10,
    hue: {
      start: 220,
      end: 220,
      curve: 'easeOutQuad',
    },
    saturation: {
      start: 0.02,
      end: 0.05,
      rate: 1,
      curve: 'easeOutQuad',
    },
    brightness: {
      start: 1,
      end: 0.15,
      curve: 'linear',
    },
  },
  options: {
    minorSteps: [0, 1, 7, 8],
    name: 'grey',
    provideInverted: false,
    rotation: 'clockwise',
  },
}

const generateScale = function (parameters, options) {
  const results = color.generate(parameters, options)
  return Object.fromEntries(
    results[0].colors.map(({ hex, step }) => {
      return [String(step * 100).padStart(2, '0'), hex]
    }),
  )
}

module.exports = {
  purge: ['./index.html', './coilix/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      grey: generateScale(config.properties, config.options),
      blue: tailwindColors.blue,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
