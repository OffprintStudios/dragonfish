<script lang="ts">
    /**
     * Original timestamp
     */
    export let timestamp = new Date().toISOString();
    /**
     * Timestamp format for display
     * @example "YYYY-MM-DD"
     */
    export let format = 'MMM DD, YYYY';
    /**
     * Set to `true` to display the relative time from the provided `timestamp`.
     * The value is displayed in a human-readable, relative format (e.g., "4 days ago", "Last week")
     * @type {boolean}
     */
    export let relative = false;
    /**
     * Set to `true` to update the relative time at 60 second interval.
     * Pass in a number (ms) to specify the interval length
     * @type {boolean | number}
     */
    export let live = false;
    /**
     * Formatted timestamp.
     * @type {string}
     */
    export let formatted = '';

    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime.js';
    import { onMount } from 'svelte';

    dayjs.extend(relativeTime);

    let interval = undefined;
    const DEFAULT_INTERVAL = 60 * 1000;
    onMount(() => {
        if (relative && live !== false) {
            interval = setInterval(() => {
                formatted = dayjs(timestamp).fromNow();
            }, Math.abs(typeof live === 'number' ? live : DEFAULT_INTERVAL));
        }
        return () => {
            if (typeof interval === 'number') {
                clearInterval(interval);
            }
        };
    });
    $: formatted = relative ? dayjs(timestamp).fromNow() : dayjs(timestamp).format(format);
    $: title = relative ? timestamp : undefined;
</script>

<time {...$$restProps} {title} datetime={timestamp}>
    {formatted}
</time>
