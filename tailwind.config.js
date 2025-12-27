/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F2540',
          50: '#E6EBF3',
          100: '#CCD7E7',
          200: '#99AECF',
          300: '#6686B7',
          400: '#335D9F',
          500: '#0F2540',
          600: '#0C1E33',
          700: '#091626',
          800: '#060F1A',
          900: '#03070D',
        },
        accent: {
          DEFAULT: '#3B82F6',
          50: '#EBF2FE',
          100: '#D7E5FD',
          200: '#AFCCFB',
          300: '#87B2F9',
          400: '#5F99F7',
          500: '#3B82F6',
          600: '#1D6BEA',
          700: '#1753BA',
          800: '#113C8A',
          900: '#0B255A',
        },
        artisan: {
          purple: '#7D37FF',
          'purple-dark': '#6A1BE0',
          coral: '#FFAEA5',
          magenta: '#E91E63',
        },
      },
      backgroundImage: {
        'gradient-purple-coral': 'linear-gradient(93deg, #6A1BE0 46.31%, #FFAEA5 93.99%)',
        'gradient-magenta': 'linear-gradient(91deg, #7D37FF 15.44%, #FFAEA5 122.78%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        artisan: {
          "primary": "#0F2540",
          "secondary": "#3B82F6",
          "accent": "#7D37FF",
          "neutral": "#1F2937",
          "base-100": "#FFFFFF",
          "base-200": "#F3F4F6",
          "base-300": "#E5E7EB",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      "light",
      "dark",
      "cupcake",
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "daisy-",
    logs: false,
    themeRoot: ":root",
  },
}
