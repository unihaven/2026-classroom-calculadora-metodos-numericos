/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {}
	},
	darkMode: "class",
	plugins: [
		nextui({
			defaultTheme: "light",
			themes: {
				light: {
					colors: {
						primary: {
							foreground: "#fff",
							DEFAULT: "#0072f5"
						},
						foreground: "#000000"
					}
				},
				dark: {
					colors: {
						primary: "#164EFF",
						background: "#0F0F0F"
					}
				}
			}
		})
	]
};
