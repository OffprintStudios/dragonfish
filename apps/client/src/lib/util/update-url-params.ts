/**
 * Updates the specified URL params to the given values
 * Used like:
 * replaceStateWithQuery({
      foo: 'bar',
      john: 'doe',
    });
 * If the value is null or undefined, that param is removed from the URL
 * Taken from https://dev.to/mohamadharith/mutating-query-params-in-sveltekit-without-page-reloads-or-navigations-2i2b
 * @param values 
 */
export const updateUrlParams = (values: Record<string, string>): void => {
    const url = new URL(window.location.toString());
    for (const [k, v] of Object.entries(values)) {
        if (v) {
            url.searchParams.set(encodeURIComponent(k), encodeURIComponent(v));
        } else {
            url.searchParams.delete(k);
        }
    }
    history.replaceState({}, '', url);
};
