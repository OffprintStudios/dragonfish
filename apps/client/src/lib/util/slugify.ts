import slug from 'slug';

/**
 * Slugifies a string for use in URLs.
 * @param value
 */
export function slugify(value: string): string {
    return slug(value);
}
