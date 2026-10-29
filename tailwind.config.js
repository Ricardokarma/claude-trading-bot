module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#06131f',
        panel: '#0d1d2a',
        border: '#1a2e3f',
        accent: '#0ea5e9',
        accent2: '#38bdf8',
        green: '#22c55e',
        red: '#ef4444',
        amber: '#f59e0b',
        slate: '#94a3b8',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(14, 165, 233, 0.25), 0 0 22px rgba(14, 165, 233, 0.2)',
      },
    },
  },
  plugins: [],
};
