export { matchers } from './client-matchers.js';

export const components = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/explore/__layout.svelte"),
	() => import("../../src/routes/social/__layout.svelte"),
	() => import("../../src/routes/explore/index.svelte"),
	() => import("../../src/routes/follows/index.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/library/index.svelte"),
	() => import("../../src/routes/search/index.svelte"),
	() => import("../../src/routes/social/index.svelte")
];

export const dictionary = {
	"": [[0, 6], [1]],
	"explore": [[0, 2, 4], [1]],
	"follows": [[0, 5], [1]],
	"library": [[0, 7], [1]],
	"search": [[0, 8], [1]],
	"social": [[0, 3, 9], [1]]
};