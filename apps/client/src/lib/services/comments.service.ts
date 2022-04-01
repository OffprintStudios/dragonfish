import { http } from './http';
import type { Comment, CommentForm, CommentKind } from '$lib/models/comments';
import type { PaginateResult } from '$lib/models/util';
import { baseUrl } from '$lib/util';

export async function fetchComments(
    itemId: string,
    kind: CommentKind,
    page: number,
): Promise<PaginateResult<Comment>> {
    return http
        .get<PaginateResult<Comment>>(
            `${baseUrl}/comments/fetch-comments?itemId=${itemId}&kind=${kind}&page=${page}`,
        )
        .then((res) => {
            return res.data;
        });
}

export async function addComment(
    profileId: string,
    itemId: string,
    kind: CommentKind,
    formData: CommentForm,
): Promise<Comment> {
    return http
        .put<Comment>(
            `${baseUrl}/comments/add-comment?pseudId=${profileId}&itemId=${itemId}&kind=${kind}`,
            formData,
        )
        .then((res) => {
            return res.data;
        });
}

export async function editComment(
    profileId: string,
    commentId: string,
    formData: CommentForm,
): Promise<Comment> {
    return http
        .patch<Comment>(
            `${baseUrl}/comments/edit-comment?pseudId=${profileId}&id=${commentId}`,
            formData,
        )
        .then((res) => {
            return res.data;
        });
}
