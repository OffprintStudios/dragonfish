export { matchers } from './client-matchers.js';

export const components = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/explore/__layout.svelte"),
	() => import("../../src/routes/social/__layout.svelte"),
	() => import("../../src/routes/explore/index.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/search/index.svelte"),
	() => import("../../src/routes/social/index.svelte")
];

export const dictionary = {
	"": [[0, 5], [1]],
	"explore": [[0, 2, 4], [1]],
	"search": [[0, 6], [1]],
	"social": [[0, 3, 7], [1]]
};