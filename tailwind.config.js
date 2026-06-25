/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0c0b0e',
        charcoal: '#16151a',
        amber: '#c9a24b',
        // 提亮暗灰文字（默认 stone 在深色背景上太暗、看不清）
        stone: {
          400: '#d6d3d1', // 默认 #a8a29e
          500: '#bcb8b3', // 默认 #78716c
          600: '#9d988f', // 默认 #57534e
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
      // 常用字号整体放大一档（响应式 md:text-* 仍更大，层级不变）
      fontSize: {
        xs: ['0.82rem', '1.2rem'], // 默认 0.75rem
        sm: ['0.95rem', '1.45rem'], // 默认 0.875rem
      },
    },
  },
  plugins: [],
}
