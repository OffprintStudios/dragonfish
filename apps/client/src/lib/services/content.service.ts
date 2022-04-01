import { http } from './http';
import type { Content, ContentFilter, ContentKind } from '$lib/models/content';
import type { Blog, PubChange } from '$lib/models/content/blogs';
import type { PaginateResult, PubContent } from '$lib/models/util';
import { baseUrl } from '$lib/util';
import type { AxiosResponse } from 'axios';
import type { FormType } from '$lib/models/content/works/forms';
import type { Section, SectionForm, PublishSection } from '$lib/models/content/works';
import type { Ratings, RatingOption } from '$lib/models/content/ratings';

//#region ---BROWSING---

export async function fetchFirstNew(contentFilter: ContentFilter): Promise<Content[]> {
    return http
        .get<Content[]>(`${baseUrl}/browse/fetch-first-new?filter=${contentFilter}`)
        .then((res) => {
            return res.data;
        });
}

export async function fetchAllNew(
    page: number,
    kinds: ContentKind[],
    filter: ContentFilter,
): Promise<PaginateResult<Content>> {
    const kindFragment = kinds.map((k) => `&kind=${k}`).join('');
    const route = `${baseUrl}/browse/fetch-all-new?filter=${filter}&pageNum=${page}${kindFragment}`;

    return http.get<PaginateResult<Content>>(route).then((res) => {
        return res.data;
    });
}

export async function fetchFirstNewsPosts(): Promise<Blog[]> {
    return http.get<Blog[]>(`${baseUrl}/news/fetch-for-home`).then((res) => res.data);
}

export async function fetchFeaturedPosts(): Promise<Blog[]> {
    return http.get<Blog[]>(`${baseUrl}/news/fetch-featured`).then((res) => res.data);
}

//#endregion

//#region ---CONTENT---

export async function fetchOne(contentId: string, profileId?: string): Promise<PubContent> {
    const route = profileId
        ? `${baseUrl}/content/fetch-one?pseudId=${profileId}&contentId=${contentId}`
        : `${baseUrl}/content/fetch-one?contentId=${contentId}`;

    return http.get<PubContent>(route).then((res) => {
        return res.data;
    });
}

export async function fetchAllByKind(
    profileId: string,
    kinds: ContentKind[],
): Promise<PaginateResult<Content>> {
    const kindFragment = kinds.map((k) => `&kind=${k}`).join('');
    return http
        .get<PaginateResult<Content>>(
            `${baseUrl}/content/fetch-all-by-kind?pseudId=${profileId}${kindFragment}`,
        )
        .then((res) => {
            return res.data;
        });
}

export async function fetchUserContent(
    profileId: string,
    filter: ContentFilter,
    kinds: ContentKind[],
    pageNum: number,
): Promise<PaginateResult<Content>> {
    const kindFragment = kinds.map((k) => `&kind=${k}`).join('');
    return http
        .get<PaginateResult<Content>>(
            `${baseUrl}/content/fetch-all-published?filter=${filter}&userId=${profileId}&pageNum=${pageNum}${kindFragment}`,
        )
        .then((res) => {
            return res.data;
        });
}

export async function createOne(
    profileId: string,
    kind: ContentKind,
    formInfo: FormType,
): Promise<AxiosResponse<Content>> {
    return http.put<Content>(
        `${baseUrl}/content/create-one?pseudId=${profileId}&kind=${kind}`,
        formInfo,
    );
}

export async function saveChanges(
    profileId: string,
    contentId: string,
    kind: ContentKind,
    formData: FormType,
): Promise<Content> {
    return http
        .patch<Content>(
            `${baseUrl}/content/save-changes?pseudId=${profileId}&contentId=${contentId}&kind=${kind}`,
            formData,
        )
        .then((res) => {
            return res.data;
        });
}

export async function deleteOne(profileId: string, contentId: string): Promise<void> {
    return http
        .patch<void>(
            `${baseUrl}/content/delete-one?pseudId=${profileId}&contentId=${contentId}`,
            {},
        )
        .then(() => {
            return;
        });
}

export async function publishOne(
    profileId: string,
    contentId: string,
    pubChange?: PubChange,
): Promise<Content> {
    return http
        .patch<Content>(
            `${baseUrl}/content/publish-one?pseudId=${profileId}&contentId=${contentId}`,
            pubChange,
        )
        .then((res) => {
            return res.data;
        });
}

//#endregion

//#region ---SECTIONS---

export async function createSection(
    profileId: string,
    contentId: string,
    formData: SectionForm,
): Promise<Section> {
    return http
        .put<Section>(
            `${baseUrl}/sections/create-section?pseudId=${profileId}&contentId=${contentId}`,
            formData,
        )
        .then((res) => {
            return res.data;
        });
}

export async function editSection(
    profileId: string,
    contentId: string,
    sectionId: string,
    formData: SectionForm,
): Promise<Section> {
    return http
        .patch<Section>(
            `${baseUrl}/sections/edit-section?pseudId=${profileId}&contentId=${contentId}&sectionId=${sectionId}`,
            formData,
        )
        .then((res) => {
            return res.data;
        });
}

export async function publishSection(
    profileId: string,
    contentId: string,
    sectionId: string,
    formData: PublishSection,
): Promise<Section> {
    return http
        .patch<Section>(
            `${baseUrl}/sections/publish-section?pseudId=${profileId}&contentId=${contentId}&sectionId=${sectionId}`,
            formData,
        )
        .then((res) => {
            return res.data;
        });
}

export async function deleteSection(
    profileId: string,
    contentId: string,
    sectionId: string,
): Promise<void> {
    return http
        .patch<void>(
            `${baseUrl}/sections/delete-section?pseudId=${profileId}&contentId=${contentId}&sectionId=${sectionId}`,
            {},
        )
        .then(() => {
            return;
        });
}

//#endregion

//#region ---RATINGS---

export async function changeVote(contentId: string, rating: RatingOption): Promise<Ratings> {
    return http
        .patch<Ratings>(
            `${baseUrl}/ratings/change-vote?contentId=${contentId}&rating=${rating}`,
            {},
        )
        .then((res) => {
            return res.data;
        });
}

//#endregion
