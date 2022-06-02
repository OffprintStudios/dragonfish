export const corsConfig = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://offprint.net',
        /\.offprint\.net$/,
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
};
