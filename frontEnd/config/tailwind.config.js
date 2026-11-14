// Tailwind CSS configuration with Yogdan design tokens
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary:        '#C0163C',
        'primary-deep': '#8B0E2A',
        'primary-glow': '#E8294E',
        accent:         '#FEE2E2',
        blush:          '#FFF9F8',
        ink:            '#1A0A0E',
        success:        '#16a34a',
        'success-soft': '#dcfce7',
        warning:        '#b45309',
        'warning-soft': '#fef9c3',
        border:         '#F3D8DC',
        muted:          '#9CA3AF',
        'card-bg':      '#FFFFFF',
        secondary:      '#FFF5F7',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        soft:   '0 1px 2px rgba(100,20,30,0.04), 0 8px 24px -12px rgba(100,20,30,0.14)',
        card:   '0 1px 1px rgba(100,20,30,0.03), 0 14px 34px -18px rgba(100,20,30,0.22)',
        crimson:'0 12px 28px -10px rgba(192,22,60,0.45)',
        phone:  '0 40px 90px -30px rgba(80,10,20,0.45)',
      },
    },
  },
  plugins: [],
};
