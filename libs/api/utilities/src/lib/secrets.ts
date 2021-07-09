/**
 * The secret key used to sign JWTs. Obtained from the
 * JWT_SECRET environment variable.
 */
export const getJwtSecretKey = () => {
    return process.env.JWT_SECRET;
};

/**
 * The amount of time, in seconds, before a JWT expires.
 * Set to 3,600 seconds, or 1 hour.
 */
export const JWT_EXPIRATION = 3600;

/**
 * The amount of time, in seconds, before a JWT expires.
 * Set to 2,592,000,000 seconds, or 30 days.
 */
export const REFRESH_EXPIRATION = 2_592_000_000;
