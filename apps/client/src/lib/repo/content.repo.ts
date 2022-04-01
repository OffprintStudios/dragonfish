import { writable } from 'svelte/store';
import type { Content } from '$lib/models/content';
import { PubStatus } from '$lib/models/content';
import type { Ratings } from '$lib/models/content/ratings';
import type { ContentLibrary } from '$lib/models/content/library';
import type { PublishSection, Section } from '$lib/models/content/works';
import { publishOne, publishSection, changeVote } from '$lib/services/content.service';
import type { RatingOption } from '$lib/models/content/ratings';

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

export function updateLibraryDoc(doc: ContentLibrary | null): void {
    content.update((state) => ({
        ...state,
        libraryDoc: doc,
    }));
}

export function addSection(section: Section): void {
    content.update((state) => ({
        ...state,
        sections: [...state.sections, section],
    }));
}

export function removeSection(section: Section): void {
    // TODO: implement section deletion
    content.update((state) => {
        return state;
    });
}

export function updateSection(section: Section): void {
    content.update((state) => {
        const currIndex = state.sections.findIndex((value) => {
            return value._id === section._id;
        });
        state.sections[currIndex] = section;
        if (state.currSection._id === section._id) {
            state.currSection = section;
        }
        return state;
    });
}

export function setCurrSection(sectionId: string): void {
    content.update((state) => {
        const currIndex = state.sections.findIndex((value) => {
            return value._id === sectionId;
        });
        state.currSection = state.sections[currIndex];

        return state;
    });
}

export async function togglePubStatus(
    profileId: string,
    contentId: string,
    sectionId: string,
    currStatus: boolean,
): Promise<void> {
    const pubStatus: PublishSection = {
        newPub: !currStatus,
        oldPub: currStatus,
    };

    await publishSection(profileId, contentId, sectionId, pubStatus).then((section) => {
        content.update((state) => {
            const currIndex = state.sections.findIndex((value) => {
                return value._id === section._id;
            });
            state.sections[currIndex] = section;

            if (pubStatus.newPub === true && pubStatus.oldPub === false) {
                // newly published
                state.content.stats.words += section.stats.words;
            } else if (pubStatus.newPub === false && pubStatus.oldPub === true) {
                // newly unpublished
                state.content.stats.words -= section.stats.words;
            }

            return state;
        });
    });
}

export async function submitToQueue(profileId: string, contentId: string): Promise<void> {
    return publishOne(profileId, contentId).then(() => {
        content.update((state) => {
            state.content.audit.published = PubStatus.Pending;
            return state;
        });
    });
}

export async function setVote(contentId: string, rating: RatingOption): Promise<void> {
    return changeVote(contentId, rating).then((res) => {
        content.update((state) => ({
            ...state,
            ratings: res,
        }));
    });
}
