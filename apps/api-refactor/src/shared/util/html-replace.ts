/**
 * Replaces &amp; with &, &lt; with <, and &gt; with >
 * @param original
 */
export function htmlReplace(original: string): string {
  if (!original) {
    return null;
  }

  return original.replace(/&amp;|&lt;|&gt;/g, function (matched) {
    switch (matched) {
      case '&amp;':
        return '&';
      case '&lt;':
        return '<';
      case '&gt;':
        return '>';
      default:
        return matched;
    }
  });
}
