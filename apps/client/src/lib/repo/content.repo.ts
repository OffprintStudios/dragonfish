import { writable } from 'svelte/store';
import type { Content } from '$lib/models/content';
import { PubStatus } from '$lib/models/content';
import type { Ratings } from '$lib/models/content/ratings';
import type { ContentLibrary } from '$lib/models/content/library';
import type { Section } from '$lib/models/content/works';
import { publishOne } from '$lib/services/content.service';

interface ContentState {
    content: Content;
    sections: Section[];
    currSection: Section;
    ratings: Ratings;
    libraryDoc: ContentLibrary;
}

const defaultContentState: ContentState = {
    content: null,
    sections: [],
    currSection: null,
    ratings: null,
    libraryDoc: null,
};

export const content = writable<ContentState>(defaultContentState);

export function setContent(
    contentModel: Content,
    sections?: Section[],
    ratings?: Ratings,
    libraryDoc?: ContentLibrary,
): void {
    content.update((state) => ({
        ...state,
        content: contentModel,
        sections: sections ? sections : [],
        ratings: ratings ? ratings : null,
        libraryDoc: libraryDoc ? libraryDoc : null,
    }));
}

export function updateContent(contentModel: Content): void {
    content.update((state) => ({
        ...state,
        content: contentModel,
    }));
}

export async function submitToQueue(profileId: string, contentId: string): Promise<void> {
    return publishOne(profileId, contentId).then(() => {
        content.update((state) => {
            state.content.audit.published = PubStatus.Pending;
            return state;
        });
    });
}
