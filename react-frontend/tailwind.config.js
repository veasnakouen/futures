
/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			borderRadius: {
				'none': '0',
				'sm': '0.125rem', // 2px
				DEFAULT: '0.25rem', // 4px
				'md': '0.25rem', // 4px
				'lg': '0.25rem', // 4px
				'xl': '0.375rem', // 6px
				'2xl': '0.375rem', // 6px
				'3xl': '0.5rem', // 8px
				'full': '9999px',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				gray: {
					'50': 'rgb(var(--gray-50) / <alpha-value>)',
					'100': 'rgb(var(--gray-100) / <alpha-value>)',
					'200': 'rgb(var(--gray-200) / <alpha-value>)',
					'300': 'rgb(var(--gray-300) / <alpha-value>)',
					'400': 'rgb(var(--gray-400) / <alpha-value>)',
					'500': 'rgb(var(--gray-500) / <alpha-value>)',
					'600': 'rgb(var(--gray-600) / <alpha-value>)',
					'700': 'rgb(var(--gray-700) / <alpha-value>)',
					'800': 'rgb(var(--gray-800) / <alpha-value>)',
					'900': 'rgb(var(--gray-900) / <alpha-value>)',
					'950': 'rgb(var(--gray-950) / <alpha-value>)'
				},
				antigravity: {
					main: '#1e1e1e',
					panel: '#252526',
					border: '#333333',
					hover: '#2a2d2e',
					input: '#3c3c3c'
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				heading: ['Outfit', 'sans-serif'],
			},
			fontSize: {
				xs: 'clamp(0.7rem, 0.65rem + 0.25vw, 0.75rem)',
				sm: 'clamp(0.8rem, 0.75rem + 0.25vw, 0.875rem)',
				base: 'clamp(0.9rem, 0.85rem + 0.25vw, 1rem)',
				lg: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
				xl: 'clamp(1.125rem, 1.075rem + 0.25vw, 1.25rem)',
				'2xl': 'clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)',
				'3xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
				'4xl': 'clamp(1.875rem, 1.625rem + 1.25vw, 2.25rem)',
				'5xl': 'clamp(2.25rem, 1.875rem + 1.875vw, 3rem)',
				'6xl': 'clamp(2.75rem, 2.25rem + 2.5vw, 3.75rem)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-up': {
					from: { transform: 'translateY(100%)' },
					to: { transform: 'translateY(0)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'slide-up': 'slide-up 0.5s ease-out forwards',
				'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
