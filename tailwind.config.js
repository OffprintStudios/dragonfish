require('dotenv').config();

module.exports = {
    purge: {
        enabled: process.env.NODE_ENV === 'production',
        content: [
            './apps/client/src/**/*.{html,ts}',
            './libs/client/editor/src/lib/**/*.{html,ts}',
            './libs/client/ui/src/lib/**/*.{html,ts}',
            './libs/client/my-stuff/src/lib/**/*.{html,ts}',
            './libs/client/dashboard/src/lib/**/*.{html,ts}',
            './libs/client/alerts/src/lib/**/*.{html,ts}',
        ],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/typography'),
    ],
};
