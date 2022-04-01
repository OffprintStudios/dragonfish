import { http } from './http';
import type { TagsTree, TagKind, TagsModel } from '$lib/models/content/works';
import type { Observable } from 'rxjs';
import { pipeData } from './pipe-data';
import type { TagsForm } from '$lib/models/content/works/forms';
import { baseUrl } from '$lib/util';


/**
 * Get all tags of the given `TagKind`, sorted into TagsTrees.
 *
 * @param kind The `TagKind` of the tags to look for.
 */
export function fetchTagsTrees(kind: TagKind): Observable<TagsTree[]> {
    return pipeData(
        http.get<TagsTree[]>(`${baseUrl}/tags/fetch-tags-trees?kind=${kind}`, {
            observe: 'response',
            withCredentials: true,
        }),
    );
}

/**
 * Get all children of the tag with the given ID.
 * Returns both the parent tag's information, and a `children` array,
 * which will either contain the child tags, or be empty.
 *
 * @param id The tag whose children will be searched for.
 */
export async function fetchDescendants(id: string): Promise<TagsTree> {
    return http.get<TagsTree>(`${baseUrl}/tags/fetch-descendants?id=${id}`, {
        observe: 'response',
        withCredentials: true,
    }).then((res) => {
        return res.data;
    });
}

/**
 * Create a tag of the given kind, with the given information.
 *
 * @param kind The `TagKind` to create.
 * @param form The input information used to create the tag.
 */
export function createTag(kind: TagKind, form: TagsForm): Observable<TagsModel> {
    return pipeData(
        http.post<TagsModel>(`${baseUrl}/tags/create-tag?kind=${kind}`, form, {
            observe: 'response',
            withCredentials: true,
        }),
    );
}

/**
 * Set the tag with the given ID's attributes to those contained in the given `TagsForm`.
 *
 * @param id The ID of the tag to update.
 * @param form The new attributes to apply to the given tag.
 */
export function updateTag(id: string, form: TagsForm): Observable<TagsModel> {
    return pipeData(
        http.patch<TagsModel>(`${baseUrl}/tags/update-tag?id=${id}`, form, {
            observe: 'response',
            withCredentials: true,
        }),
    );
}

/**
 * Delete the tag with the given ID from the tags collection, and remove
 * **all** references to it from **all** content.
 *
 * @param id The ID of the tag to delete.
 */
export function deleteTag(id: string): Observable<void> {
    return pipeData(
        http.patch<void>(
            `${baseUrl}/tags/delete-tag?id=${id}`,
            {},
            {
                observe: 'response',
                withCredentials: true,
            },
        ),
    );
}
