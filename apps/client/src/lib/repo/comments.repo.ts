import { get, writable } from 'svelte/store';
import { comments as commentsService } from '$lib/services';
import type { Comment, CommentForm } from '$lib/models/comments';
import { CommentKind } from '$lib/models/comments';
import type { PaginateResult } from '$lib/models/util';
import { session } from '$lib/repo/session.repo';

interface CommentsState {
    threadId: string;
    kind: CommentKind;
    comments: Comment[];
    currPage: number;
    totalComments: number;
    perPage: number;
    totalPages: number;
}

const defaultCommentsState: CommentsState = {
    threadId: null,
    kind: CommentKind.ContentComment,
    comments: [],
    currPage: 1,
    totalComments: 0,
    perPage: 50,
    totalPages: 1,
};

export const comments = writable<CommentsState>(defaultCommentsState);

//#region ---HELPERS---

export async function getPage(
    itemId: string,
    kind: CommentKind,
    page: number,
): Promise<PaginateResult<Comment>> {
    return await commentsService.fetchComments(itemId, kind, page).then((res) => {
        comments.set({
            threadId: itemId,
            kind: kind,
            comments: res.docs,
            currPage: res.page,
            totalComments: res.totalDocs,
            perPage: res.limit,
            totalPages: res.totalPages,
        });
        return res;
    });
}

export async function addComment(
    profileId: string,
    itemId: string,
    kind: CommentKind,
    formData: CommentForm,
): Promise<void> {
    return await commentsService.addComment(profileId, itemId, kind, formData).then((res) => {
        comments.update((state) => {
            res.user = get(session).currProfile ?? null;
            state.comments = [...state.comments, res];
            return state;
        });
    });
}

export async function editComment(
    profileId: string,
    commentId: string,
    formData: CommentForm,
): Promise<void> {
    return await commentsService.editComment(profileId, commentId, formData).then((res) => {
        comments.update((state) => ({
            ...state,
            comments: replaceComment(state.comments, res),
        }));
    });
}

export function addReply(comment: Comment): string {
    return `
                <blockquote data-commentid="${comment._id}">
                    <span style="display: flex; align-items: center; margin-bottom: 1.5rem;">
                        <img src="${comment.user.profile.avatar}" alt="avatar" style="display: block; width: 2rem; height: 2rem; border-radius: 9999px;" />
                        <h5 style="font-weight: 500; font-size: 1.15rem;">${comment.user.screenName} said:</h5>
                    </span>
                    ${comment.body}
                </blockquote>
            `;
}

function replaceComment(comments: Comment[], newComment: Comment) {
    const index = comments.findIndex((value) => {
        return value._id === newComment._id;
    });
    comments[index] = newComment;
    return comments;
}

//#endregion
