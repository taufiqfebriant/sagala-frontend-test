/** @type {import('prettier').Config} */
const config = {
	useTabs: true,
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindFunctions: ["clsx"]
};

export default config;
