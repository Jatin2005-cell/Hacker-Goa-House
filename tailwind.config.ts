import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF3E1',
        teal: '#0E4C43',
        tealDark: '#08312B',
        coral: '#FF5A6E',
        mango: '#FFC23C',
        ink: '#14231E',
        aqua: '#35B0A0'
      },
      fontFamily: {
        display: ['var(--font-anton)', 'sans-serif'],
        deva: ['var(--font-baloobhai)', 'sans-serif'],
        body: ['var(--font-poppins)', 'sans-serif']
      },
      boxShadow: {
        card: '0 20px 50px -15px rgba(8,49,43,0.45)'
      }
    }
  },
  plugins: []
};

export default config;
