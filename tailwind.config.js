export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
        rose: 'hsl(var(--rose) / <alpha-value>)',
        'rose-light': 'hsl(var(--rose-light) / <alpha-value>)',
        'rose-pale': 'hsl(var(--rose-pale) / <alpha-value>)',
        'pastel-pink': 'hsl(var(--pastel-pink) / <alpha-value>)',
        'pastel-pink-accent': 'hsl(var(--pastel-pink-accent) / <alpha-value>)',
        'pastel-pink-dark': 'hsl(var(--pastel-pink-dark) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}