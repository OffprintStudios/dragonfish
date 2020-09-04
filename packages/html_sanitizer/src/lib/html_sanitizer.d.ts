/* tslint:disable */
/* eslint-disable */
/**
* Takes the given HTML string and removes anything not allowed.
* Preserves inline styles on div, p, a, img, and h1-h6 tags.
* ## Arguments
*
* * `html_string` - A string containing HTML to be sanitized.
* @param {string} html_string
* @returns {string}
*/
export function sanitize_html(html_string: string): string;
/**
* Attempts to remove **all** HTML from the given string, and returns only
* the text contained within.
* ## Arguments
*
* * `html_string` - A string containing the HTML to be sanitized.
* @param {string} html_string
* @returns {string}
*/
export function strip_all_html(html_string: string): string;
