import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS_OPTIONS: CorsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:300',
    /\.offprint\.net$/,
    /\.dragonfish\.pages\.dev$/,
  ],
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
};
