const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'class',

	theme: {
		extend: {}
	},

	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/line-clamp'),
		require('tailwindcss-opentype'),
		require('daisyui')
	],

	daisyui: {
		styled: false,
		themes: false,
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: "daisy",
		darkTheme: "dark",
	},
};

module.exports = config;
