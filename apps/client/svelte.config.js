import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: [
        preprocess({
            postcss: true,

            scss: {
                prependData: '@import "src/variables.scss";',
            },
        }),
    ],

    kit: {
        adapter: adapter(),

        vite: {
            css: {
                preprocessorOptions: {
                    scss: {
                        additionalData: '@import "src/variables.scss";',
                    },
                },
            },
        },
    },
};

export default config;
