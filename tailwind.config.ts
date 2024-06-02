import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import reactAriaComponentsPlugin from "tailwindcss-react-aria-components";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
	theme: {
		extend: {
			screens: {
				xl: '1200px'
			}
		}
	},
  plugins: [animatePlugin, reactAriaComponentsPlugin],
};
export default config;
