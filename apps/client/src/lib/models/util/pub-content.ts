import type { Ratings } from '$lib/models/content/ratings';
import type { Content } from '$lib/models/content';
import type { ContentLibrary } from '$lib/models/content/library';

export interface PubContent {
    content: Content;
    ratings: Ratings;
    libraryDoc: ContentLibrary;
}
