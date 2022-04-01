import { http } from './http';
import { baseUrl } from '$lib/util';
import type {
    BookshelfForm,
    ContentLibrary,
    Bookshelf,
    ShelfItem,
} from '$lib/models/content/library';

//#region ---CONTENT LIBRARY---

export async function fetchLibrary(profileId: string): Promise<ContentLibrary[]> {
    return http
        .get<ContentLibrary[]>(`${baseUrl}/content-library/fetch?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function addToLibrary(profileId: string, contentId: string): Promise<ContentLibrary> {
    return http
        .put<ContentLibrary>(
            `${baseUrl}/content-library/add-to?pseudId=${profileId}&contentId=${contentId}`,
            {},
        )
        .then((res) => {
            return res.data;
        });
}

export async function removeFromLibrary(profileId: string, contentId: string): Promise<void> {
    return http
        .deleteReq<void>(
            `${baseUrl}/content-library/remove?pseudId=${profileId}&contentId=${contentId}`,
        )
        .then((res) => {
            return res.data;
        });
}

//#endregion

//#region ---BOOKSHELVES---

export async function fetchShelves(profileId: string): Promise<Bookshelf[]> {
    return http
        .get<Bookshelf[]>(`${baseUrl}/bookshelves/fetch-bookshelves?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function fetchPublicShelves(profileId: string): Promise<Bookshelf[]> {
    return http
        .get<Bookshelf[]>(`${baseUrl}/bookshelves/fetch-public-bookshelves?pseudId=${profileId}`)
        .then((res) => {
            return res.data;
        });
}

export async function fetchShelf(profileId: string, shelfId: string): Promise<Bookshelf> {
    return http
        .get<Bookshelf>(
            `${baseUrl}/bookshelves/fetch-one-bookshelf?pseudId=${profileId}&shelfId=${shelfId}`,
        )
        .then((res) => {
            return res.data;
        });
}

export async function createShelf(profileId: string, shelfForm: BookshelfForm): Promise<Bookshelf> {
    return http
        .post<Bookshelf>(`${baseUrl}/bookshelves/create-bookshelf?pseudId=${profileId}`, shelfForm)
        .then((res) => {
            return res.data;
        });
}

export async function editShelf(
    profileId: string,
    shelfId: string,
    shelfForm: BookshelfForm,
): Promise<Bookshelf> {
    return http
        .patch<Bookshelf>(
            `${baseUrl}/bookshelves/edit-bookshelf?pseudId=${profileId}&shelfId=${shelfId}`,
            shelfForm,
        )
        .then((res) => {
            return res.data;
        });
}

export async function toggleVisibility(profileId: string, shelfId: string): Promise<Bookshelf> {
    return http
        .patch<Bookshelf>(
            `${baseUrl}/bookshelves/toggle-visibility?pseudId=${profileId}&shelfId=${shelfId}`,
            {},
        )
        .then((res) => {
            return res.data;
        });
}

export async function deleteShelf(profileId: string, shelfId: string): Promise<void> {
    return http
        .deleteReq<void>(
            `${baseUrl}/bookshelves/delete-bookshelf?pseudId=${profileId}&shelfId=${shelfId}`,
        )
        .then(() => {
            return;
        });
}

//#endregion

//#region ---SHELF ITEMS---

export async function addToShelf(
    profileId: string,
    shelfId: string,
    contentId: string,
): Promise<void> {
    return http
        .post<void>(
            `${baseUrl}/bookshelves/add-item?pseudId=${profileId}&shelfId=${shelfId}&contentId=${contentId}`,
            {},
        )
        .then(() => {
            return;
        });
}

export async function removeFromShelf(
    profileId: string,
    shelfId: string,
    contentId: string,
): Promise<void> {
    return http
        .deleteReq<void>(
            `${baseUrl}/bookshelves/remove-item?pseudId=${profileId}&shelfId=${shelfId}&contentId=${contentId}`,
        )
        .then(() => {
            return;
        });
}

export async function fetchShelfItems(profileId: string, shelfId: string): Promise<ShelfItem[]> {
    return http
        .get<ShelfItem[]>(
            `${baseUrl}/bookshelves/fetch-items?pseudId=${profileId}&shelfId=${shelfId}`,
        )
        .then((res) => {
            return res.data;
        });
}

export async function checkShelfItem(
    profileId: string,
    shelfId: string,
    contentId: string,
): Promise<boolean> {
    return http
        .get<{ isPresent: boolean }>(
            `${baseUrl}/bookshelves/check-item?pseudId=${profileId}&shelfId=${shelfId}&contentId=${contentId}`,
        )
        .then((res) => {
            return res.data.isPresent;
        });
}

//#endregion
