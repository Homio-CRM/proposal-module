import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-helvetica-now-display)',
  				'ui-sans-serif',
  				'system-ui'
  			]
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			'gray': {
  				'0': '#F7F9FC',
  				'50': '#E9EDF5',
  				'100': '#D5DBE5',
  				'200': '#BCC2CE',
  				'300': '#A1A9B8',
  				'400': '#868FA0',
  				'500': '#687182',
  				'600': '#5A6376',
  				'700': '#464F60',
  				'800': '#333B4A',
  				'900': '#171C26'
  			},
  			'indigo': {
  				'0': '#EDEDFC',
  				'50': '#DFDEFC',
  				'100': '#D0CFFC',
  				'200': '#B9B6FA',
  				'300': '#9E9BF5',
  				'400': '#807CEA',
  				'500': '#5E5ADB',
  				'600': '#4945C4',
  				'700': '#3734A3',
  				'800': '#3734A3',
  				'900': '#151357'
  			},
  			'blue': {
  				'300': '#036DCB'
  			},
  			'purple': {
  				'300': '#8B3BC4'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
