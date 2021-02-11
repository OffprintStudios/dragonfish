import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ApprovalQueue } from '@dragonfish/models/approval-queue';
import { ContentKind, ContentModel, NewsContentModel, SetRating } from '@dragonfish/models/content';
import { Decision } from '@dragonfish/models/contrib';
import {
    FrontendUser,
    CreateUser,
    LoginUser,
    User,
    UpdateTagline,
    ChangeEmail,
    ChangeUsername,
    ChangePassword,
    ChangeProfile,
} from '@dragonfish/models/users';
import { InitialResults, PaginateResult } from '@dragonfish/models/util';
import { Section } from '@dragonfish/models/works';
import { FrontPageStats } from '@dragonfish/models/stats';
import { Collection, CollectionForm } from '@dragonfish/models/collections';
import { ContentComment, CreateComment, EditComment } from '@dragonfish/models/comments';
import { ReadingHistory } from '@dragonfish/models/reading-history';
import { CreateInitialMessage, CreateResponse, MessageThread } from '@dragonfish/models/messages';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { HttpError } from '../models/site';
import { MarkReadRequest, NotificationBase, NotificationSubscription } from '@dragonfish/models/notifications';

/**
 * ## NetworkService
 *
 * Manages API calls to the backend.
 */
@Injectable({
    providedIn: 'root',
})
export class NetworkService {
    private baseUrl = `/api`;
    constructor(private readonly http: HttpClient) {}

    /**
     * Handles a common response pattern for HTTP requests. Automatically returns the response
     * body on success, or calls `throwError(err)` on error. Allows a callback to be passed in,
     * which will be called before returning success or error.
     * @param response An observable wrapped around the HTTP request.
     * @param onSuccess A callback to call upon success. Defaults to null.
     * @param onError A callback to call upon error. Defaults to null.
     */
    private handleResponse<T>(
        response: Observable<HttpResponse<T>>,
        onSuccess: (success: HttpResponse<T>) => void = null,
        onError: (error: any) => void = null,
    ): Observable<T> {
        return response.pipe(
            map((resp) => {
                if (onSuccess) {
                    onSuccess(resp);
                }
                return resp.body;
            }),
            catchError((err) => {
                if (onError) {
                    onError(err);
                }
                return throwError(err);
            }),
        );
    }

    /**
     * Attempts to parse an HttpError from a JSON string.
     *
     * @param response The response to parse
     */
    private tryParseJsonHttpError(response: string): HttpError | null {
        try {
            const error: HttpError = JSON.parse(response);
            return error;
        } catch (err) {
            return null;
        }
    }

    //#region ---APPROVAL QUEUE---

    /**
     * Gets the entire queue.
     */
    public fetchApprovalQueue(pageNum: number): Observable<PaginateResult<ApprovalQueue>> {
        return this.handleResponse(
            this.http.get<PaginateResult<ApprovalQueue>>(`${this.baseUrl}/approval-queue/get-queue/${pageNum}`, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Claims a work from the approval queue..
     *
     * @param docId The document to claim
     */
    public claimWork(docId: string): Observable<ApprovalQueue> {
        return this.handleResponse(
            this.http.patch<ApprovalQueue>(
                `${this.baseUrl}/approval-queue/claim-work/${docId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
        );
    }

    /**
     * Approves a work in the approval queue.
     *
     * @param decision Info about the decision.
     */
    public approveWork(decision: Decision): Observable<void> {
        return this.handleResponse(
            this.http.patch<void>(`${this.baseUrl}/approval-queue/approve-work`, decision, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Rejects a work in the approval queue.
     *
     * @param decision Info about the decision.
     */
    public rejectWork(decision: Decision): Observable<void> {
        return this.handleResponse(
            this.http.patch<void>(`${this.baseUrl}/approval-queue/reject-work`, decision, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Fetches a piece of content for viewing within the dashboard.
     *
     * @param contentId The content ID
     * @param kind The content kind
     * @param userId The owner of the content
     */
    public viewDashboardContent(contentId: string, kind: ContentKind, userId: string): Observable<ContentModel> {
        return this.handleResponse(
            this.http.get<ContentModel>(
                `${this.baseUrl}/approval-queue/view-content?contentId=${contentId}&kind=${kind}&userId=${userId}`,
                { observe: 'response', withCredentials: true },
            ),
            null,
            (_err) => {
                //this.snackBar.open(`Something went wrong! Try again in a little bit.`);
            },
        );
    }

    /**
     * Submits a work to the approval queue.
     *
     * @param workId The work to submit
     */
    public submitWorkForApproval(workId: string) {
        return this.handleResponse(
            this.http.post<void>(
                `${this.baseUrl}/approval-queue/submit-work/${workId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
            (resp) => {
                //this.alertsService.success(`Work successfully submitted!`);
            },
            (err) => {
                // if (err.error.message) {
                //   this.alertsService.error(`HTTP ${err.status}: ${err.error.message}`);
                // } else {
                //   this.alertsService.error(`Something went wrong! Try again in a little bit.\nDetails: HTTP ${err.status}`);
                // }
            },
        );
    }

    //#endregion

    //#region ---AUTH---

    /**
     * Sends a new user's info to the backend. If the response is successful,
     * the `user` is returned and their info is set in local storage. Otherwise,
     * sends the backend error to all subscribed observables.
     *
     * @param credentials A user's credentials.
     */
    public register(credentials: CreateUser): Observable<FrontendUser> {
        return this.handleResponse(
            this.http.post<FrontendUser>(`${this.baseUrl}/auth/register`, credentials, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Sends a returning user's credentials to the backend to be verified.
     * If the response is successful, the `user` is returned. Otherwise, sends the backend error to all
     * subscribed observables.
     *
     * @param credentials A user's credentials.
     */
    public login(credentials: LoginUser): Observable<FrontendUser> {
        return this.handleResponse(
            this.http.post<FrontendUser>(`${this.baseUrl}/auth/login`, credentials, {
                withCredentials: true,
                observe: 'response',
            }),
        );
    }

    /**
     * Logs the user out.
     */
    public logout(): Observable<void> {
        return this.http.get<void>(`${this.baseUrl}/auth/logout`, { withCredentials: true });
    }

    /**
     * Refreshes the current user token with new User info.
     * If refresh fails, return `null`.
     */
    public refreshToken(): Observable<string | null> {
        return this.http
            .get<{ newToken: string }>(`${this.baseUrl}/auth/refresh-token`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((user) => {
                    return user.body.newToken;
                }),
                catchError((err) => {
                    if (err.status === 403) {
                        // A 403 means that the refreshToken has expired, or we didn't send one up at all, which is Super Suspicious
                        return null;
                    }
                    return throwError(err);
                }),
            );
    }
    // #endregion

    //#region ---COLLECTIONS---

    /**
     * Creates a collection in the database.
     *
     * @param collInfo A collection's info
     */
    public createCollection(collInfo: CollectionForm) {
        return this.handleResponse(
            this.http.put<void>(`${this.baseUrl}/collections/create-collection`, collInfo, {
                observe: 'response',
                withCredentials: true,
            }),
            (resp) => {
                //this.alertsService.success(`Collection successfully created.`);
            },
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Fetches a user's collections.
     */
    public fetchAllCollections(pageNum: number) {
        return this.handleResponse(
            this.http.get<PaginateResult<Collection>>(
                `${this.baseUrl}/collections/get-all-collections?pageNum=${pageNum}`,
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Fetches one collection for the logged-in user. Can retrieve both public and private collections.
     * @param collId The ID of the collection to fetch.
     */
    public fetchOneCollection(collId: string): Observable<Collection> {
        return this.handleResponse(
            this.http.get<Collection>(`${this.baseUrl}/collections/get-one-collection?collId=${collId}`, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Fetches one collection for a user. Will only look for private collections.
     * @param userId The ID of the user that owns the collection.
     * @param collId The collection's ID.
     */
    public fetchOnePublicCollection(userId: string, collId: string): Observable<Collection> {
        return this.handleResponse(
            this.http.get<Collection>(
                `${this.baseUrl}/collections/get-one-public-collection?userId=${userId}&collId=${collId}`,
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Fetches all the collections that are public for a given user.
     * @param userId The ID of the user whose collections will be fetched.
     * @param pageNum The page number to fetch.
     */
    public fetchPublicCollections(userId: string, pageNum: number) {
        return this.handleResponse(
            this.http.get<PaginateResult<Collection>>(
                `${this.baseUrl}/collections/get-public-collections?userId=${userId}&pageNum=${pageNum}`,
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Fetches a user's collections without pagination.
     */
    public fetchAllCollectionsNoPaginate() {
        return this.handleResponse(
            this.http.get<Collection[]>(`${this.baseUrl}/collections/get-all-collections-no-paginate`, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Sends edits for a collection to the database.
     *
     * @param collId A collection's ID
     * @param collInfo The new collection info
     */
    public editCollection(collId: string, collInfo: CollectionForm) {
        return this.handleResponse(
            this.http.patch<void>(`${this.baseUrl}/collections/edit-collection?collId=${collId}`, collInfo, {
                observe: 'response',
                withCredentials: true,
            }),
            (resp) => {
                //this.alertsService.success(`Edits saved successfully.`);
            },
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Deletes a collection belonging to this user.
     *
     * @param collId The collection ID
     */
    public deleteCollection(collId: string) {
        return this.handleResponse(
            this.http.patch<void>(
                `${this.baseUrl}/collections/delete-collection?collId=${collId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
            (resp) => {
                //this.alertsService.success(`Collection deleted successfully.`);
            },
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Adds a work to a collection.
     *
     * @param collId The collection
     * @param workId The work
     */
    public addWorkToCollection(collId: string, workId: string) {
        return this.handleResponse(
            this.http.patch<void>(
                `${this.baseUrl}/collections/add-content?collId=${collId}&contentId=${workId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
            (resp) => {
                //this.alertsService.success(`Work added to collection.`);
            },
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Removes a work from a collection.
     *
     * @param collId The collection
     * @param workId The work
     */
    public removeWorkFromCollection(collId: string, workId: string) {
        return this.handleResponse(
            this.http.patch<void>(
                `${this.baseUrl}/collections/remove-content?collId=${collId}&contentId=${workId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
            (resp) => {
                //this.alertsService.success(`Work removed from collection.`);
            },
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Sends a request to set a collection to public to the backend.
     *
     * @param collId The collection's ID
     */
    public setCollectionToPublic(collId: string) {
        return this.handleResponse(
            this.http.patch<void>(
                `${this.baseUrl}/collections/set-public?collId=${collId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.alertsService.error(`Something went wrong! Try again in a little bit.`);
            },
        );
    }

    /**
     * Sends a request to set a collection to private to the backend.
     *
     * @param collId The collection's ID
     */
    public setCollectionToPrivate(collId: string) {
        return this.handleResponse(
            this.http.patch<void>(
                `${this.baseUrl}/collections/set-private?collId=${collId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.alertsService.error(`Something went wrong! Try again in a little bit.`);
            },
        );
    }

    //#endregion

    //#region ---COMMENTS---

    public addContentComment(contentId: string, commentInfo: CreateComment) {
        return this.handleResponse(
            this.http.put<ContentComment>(`${this.baseUrl}/comments/add-content-comment/${contentId}`, commentInfo, {
                observe: 'response',
                withCredentials: true,
            }),
            (resp) => {
                //this.alertsService.success(`Comment added successfully!`);
            },
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    public fetchContentComments(contentId: string, pageNum: number) {
        return this.handleResponse(
            this.http.get<PaginateResult<ContentComment>>(
                `${this.baseUrl}/comments/get-content-comments/${contentId}/${pageNum}`,
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Edits a comment.
     *
     * @param commentId The comment to edit
     * @param commentInfo The new info about it
     */
    public editComment(commentId: string, commentInfo: EditComment) {
        return this.handleResponse(
            this.http.patch(`${this.baseUrl}/comments/edit-comment/${commentId}`, commentInfo, {
                observe: 'response',
                withCredentials: true,
            }),
            (resp) => {
                //this.alertsService.success(`Changes saved!`);
            },
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    //#endregion

    //#region ---CONTENT---

    /**
     * Fetches one piece of published content from the API.
     *
     * @param contentId The content ID
     * @param kind The content kind
     */
    public fetchContent(contentId: string, kind: ContentKind): Observable<ContentModel> {
        return this.handleResponse(
            this.http.get<ContentModel>(
                `${this.baseUrl}/content/fetch-one-published?contentId=${contentId}&kind=${kind}`,
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.snackBar.open(`Something went wrong fetching this content. Try again in a little bit.`);
            },
        );
    }

    /**
     * Finds a related reading history document, provided the `contentId`. Creates one if none exist, or
     * updates an existing one if something is found.
     *
     * @param contentId The related content
     */
    public fetchRelatedHistory(contentId: string): Observable<ReadingHistory> {
        return this.handleResponse(
            this.http.post<ReadingHistory>(
                `${this.baseUrl}/history/add-or-update-history/${contentId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.snackBar.open(err.error.message);
            },
        );
    }

    /**
     * Fetches all published content from the API that matches the provided `kinds`. Optionally filters
     * the results by a provided `userId`.
     *
     * @param pageNum The current page
     * @param kinds The kinds of content to include
     * @param userId (Optional) The author of this content
     */
    public fetchAllContent(
        pageNum: number,
        kinds: ContentKind[],
        userId?: string,
    ): Observable<PaginateResult<ContentModel>> {
        let route = ``;

        // If we just include the kind array as-is, it'll be serialized as "&kind=Kind1,Kind2" which the backend will interpret as
        // the string 'Kind1,Kind2' which is not what we want. So, we manually split it out into a query string
        // which becomes "&kind=Kind1&kind=Kind2", etc.
        const kindFragment = kinds.map((k) => `&kind=${k}`).join('');
        if (userId) {
            route = `${this.baseUrl}/content/fetch-all-published?pageNum=${pageNum}&userId=${userId}${kindFragment}`;
        } else {
            route = `${this.baseUrl}/content/fetch-all-published?pageNum=${pageNum}${kindFragment}`;
        }

        return this.handleResponse(
            this.http.get<PaginateResult<ContentModel>>(route, { observe: 'response', withCredentials: true }),
            null,
            (err) => {
                //this.snackBar.open(`Something went wrong fetching this content. Try again in a little bit.`);
            },
        );
    }

    /**
     * Fetches one section from the API using the provided `sectionID`.
     *
     * @param sectionId The section ID
     */
    public fetchSection(sectionId: string): Observable<Section> {
        return this.handleResponse(
            this.http.get<Section>(`${this.baseUrl}/sections/fetch-one-by-id?sectionId=${sectionId}&published=true`, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(`Something went wrong fetching this section. Try again in a little bit.`);
            },
        );
    }

    /**
     * Sets a user's rating to Liked.
     *
     * @param setRating Information to set the new rating
     */
    public setLike(setRating: SetRating): Observable<ReadingHistory> {
        return this.handleResponse(
            this.http.patch<ReadingHistory>(`${this.baseUrl}/content/set-like`, setRating, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(err.error.message);
            },
        );
    }

    /**
     * Sets a user's rating to Disliked.
     *
     * @param setRating Information to set the new rating
     */
    public setDislike(setRating: SetRating): Observable<ReadingHistory> {
        return this.handleResponse(
            this.http.patch<ReadingHistory>(`${this.baseUrl}/content/set-dislike`, setRating, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(err.error.message);
            },
        );
    }

    /**
     * Sets a user's rating to NoVote.
     *
     * @param setRating Information to set the new rating
     */
    public setNoVote(setRating: SetRating): Observable<ReadingHistory> {
        return this.handleResponse(
            this.http.patch<ReadingHistory>(`${this.baseUrl}/content/set-no-vote`, setRating, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(err.error.message);
            },
        );
    }
    //#endregion

    //#region ---COVER ART & AVATARS---

    /**
     * Uses the given uploader to an image up to the server. Attempts to cast
     * the server's response into a T and return it.
     *
     * @param uploader The file uploader, prefilled with the URL and instructions for uploading the image.
     */
    public changeImage<T extends FrontendUser | ContentModel>(uploader: FileUploader): Observable<T> {
        return new Observable<T>((observer) => {
            uploader.onCompleteItem = (_: FileItem, response: string, status: number, __: ParsedResponseHeaders) => {
                if (status !== 201) {
                    const errorMessage: HttpError = this.tryParseJsonHttpError(response);
                    if (!errorMessage) {
                        const juryRiggedError: HttpError = {
                            statusCode: status,
                            error: response,
                        };
                        return observer.error(juryRiggedError);
                    } else {
                        return observer.error(errorMessage);
                    }
                }

                const work: T = JSON.parse(response);
                observer.next(work);
                observer.complete();
            };

            uploader.uploadAll();
        });
    }

    //#endregion

    //#region ---HISTORY---

    /**
     * Fetches a user's entire history, paginated.
     */
    public fetchUserHistory(pageNum: number): Observable<PaginateResult<ReadingHistory>> {
        return this.handleResponse(
            this.http.get<PaginateResult<ReadingHistory>>(`${this.baseUrl}/history/fetch-user-history/${pageNum}`, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Fetches a user's history for their sidenav.
     */
    public fetchUserSidenavHistory(): Observable<ReadingHistory[]> {
        return this.handleResponse(
            this.http.get<ReadingHistory[]>(`${this.baseUrl}/history/fetch-user-sidenav-history`, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Fetches one history doc without updating the viewedOn date.
     */
    public fetchOneHistDoc(workId: string): Observable<ReadingHistory> {
        return this.handleResponse(
            this.http.get<ReadingHistory>(`${this.baseUrl}/history/fetch-one-hist-doc/${workId}`, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Adds a new history document, or updates an existing one.
     *
     * @param workId The work to parse
     */
    public addOrUpdateHistory(workId: string): Observable<ReadingHistory> {
        return this.handleResponse(
            this.http.post<ReadingHistory>(
                `${this.baseUrl}/history/add-or-update-history/${workId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    /**
     * Soft deletes a history doc by setting its visibility to false.
     *
     * @param histId The ID of the history document
     */
    public changeHistoryVisibility(histId: string): Observable<void> {
        return this.handleResponse(
            this.http.patch<void>(
                `${this.baseUrl}/history/change-item-visibility/${histId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
            (resp) => {
                //this.alertsService.success(`Item successfully removed.`);
            },
            (err) => {
                //this.alertsService.error(err.error.message);
            },
        );
    }

    //#endregion

    //#region ---MESSAGES---

    /**
     * Fetches a user's threads.
     */
    public fetchUserThreads(pageNum: number) {
        return this.handleResponse(
            this.http.get<PaginateResult<MessageThread>>(`${this.baseUrl}/messages/fetch-user--threads/${pageNum}`, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Fetches a user's threads for the sidenav.
     */
    public fetchUserSidenavThreads() {
        return this.handleResponse(
            this.http.get<MessageThread[]>(`${this.baseUrl}/messages/fetch-user-sidenav-threads`, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Creates a new thread with a single message, directed towards one user.
     *
     * @param initialMessage The initial message of the thread
     */
    public createNewPrivateThread(initialMessage: CreateInitialMessage) {
        return this.handleResponse(
            this.http.put<void>(`${this.baseUrl}/messages/create-new-private-thread`, initialMessage, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Responds to a single thread.
     *
     * @param response A new response
     */
    public createResponse(response: CreateResponse) {
        return this.handleResponse(
            this.http.put<void>(`${this.baseUrl}/messages/create-response`, response, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    //#endregion

    //#region ---NEWS CONSUMPTION--

    /**
     * Gets the inital posts for the home page.
     */
    public fetchInitialNewsPosts(): Observable<NewsContentModel[]> {
        return this.handleResponse(
            this.http.get<NewsContentModel[]>(`${this.baseUrl}/news/initial-posts`, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(`${err.error.message}`);
            },
        );
    }

    /**
     * Fetches a page of news results.
     *
     * @param pageNum The current page
     */
    public fetchNewsFeed(pageNum: number): Observable<PaginateResult<NewsContentModel>> {
        return this.handleResponse(
            this.http.get<PaginateResult<NewsContentModel>>(`${this.baseUrl}/news/news-feed/${pageNum}`, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(`${err.error.message}`);
            },
        );
    }

    /**
     * Grabs one newspost from the database.
     *
     * @param postId The post to fetch
     */
    public fetchNewsPost(postId: string) {
        return this.handleResponse(
            this.http.get<NewsContentModel>(`${this.baseUrl}/news/news-post/${postId}`, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(`${err.error.message}`);
            },
        );
    }

    //#endregion

    //#region ---NOTIFICATIONS---

    /**
     * Gets all of the current user's notifications.
     */
    public fetchAllNotifications(): Observable<NotificationBase[]> {
        return this.handleResponse(
            this.http.get<NotificationBase[]>(`${this.baseUrl}/notifications/all-notifications`, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Gets all of the current user's _unread_ notifications.
     */
    public fetchUnreadNotifications(): Observable<NotificationBase[]> {
        return this.handleResponse(
            this.http.get<NotificationBase[]>(`${this.baseUrl}/notifications/unread-notifications`, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Marks the given notifications as read.
     * @param toMark A list of notification IDs to mark as read.
     */
    public markNotificationsAsRead(toMark: MarkReadRequest): Observable<void> {
        return this.handleResponse(
            this.http.post<void>(`${this.baseUrl}/notifications/mark-as-read`, toMark, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Gets a list of all the things the current user is subscribed to notifications for.
     */
    public fetchNotificationSubscriptions(): Observable<NotificationSubscription[]> {
        return this.handleResponse(
            this.http.get<NotificationSubscription[]>(`${this.baseUrl}/notifications/unread-notifications`, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Subscribe to notifications on the source with the given ID.
     * @param sourceId ID of the thing to subscribe to notifications for.
     */
    public subscribeToNotifications(sourceId: string): Observable<void> {
        return this.handleResponse(
            this.http.post<void>(
                `${this.baseUrl}/notifications/subscribe?sourceId=${sourceId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
        );
    }

    /**
     * Unsubscribe to notifications on the source with the given ID.
     * @param sourceId ID of the thing to unsubscribe from.
     */
    public unsubscribeFromNotifications(sourceId: string): Observable<void> {
        return this.handleResponse(
            this.http.post<void>(
                `${this.baseUrl}/notifications/unsubscribe?sourceId=${sourceId}`,
                {},
                { observe: 'response', withCredentials: true },
            ),
        );
    }

    //#endregion

    //#region ---SEARCH---

    /**
     * Search for the given query, and return the top 3 results in Works, Blogs, and Users.
     * @param query The user's search string.
     */
    public searchInitialResults(query: string): Observable<InitialResults> {
        return this.handleResponse(
            this.http.get<InitialResults>(`${this.baseUrl}/search/get-initial-results?query=${query}`, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.alertsService.error(`Something went wrong! Try again in a little bit.`);
            },
        );
    }

    public searchWorks(query: string, pageNum: number): Observable<PaginateResult<ContentModel>> {
        return this.handleResponse(
            this.http.get<PaginateResult<ContentModel>>(
                `${this.baseUrl}/search/get-work-results?query=${query}&pageNum=${pageNum}`,
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.alertsService.error(`Something went wrong! Try again in a little bit.`);
            },
        );
    }

    public searchBlogs(query: string, pageNum: number): Observable<PaginateResult<ContentModel>> {
        return this.handleResponse(
            this.http.get<PaginateResult<ContentModel>>(
                `${this.baseUrl}/search/get-blog-results?query=${query}&pageNum=${pageNum}`,
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.alertsService.error(`Something with wrong! Try again in a little bit.`);
            },
        );
    }

    public searchUsers(query: string, pageNum: number): Observable<PaginateResult<User>> {
        return this.handleResponse(
            this.http.get<PaginateResult<User>>(
                `${this.baseUrl}/search/get-user-results?query=${query}&pageNum=${pageNum}`,
                { observe: 'response', withCredentials: true },
            ),
            null,
            (err) => {
                //this.alertsService.error(`Something with wrong! Try again in a little bit.`);
            },
        );
    }

    //#endregion

    //#region ---STATS---

    /**
     * Fetches the stats for the footer.
     */
    public fetchFrontPageStats() {
        return this.handleResponse(
            this.http.get<FrontPageStats>(`${this.baseUrl}/meta/public-stats`, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.alertsService.error(`Error retrieving frontpage stats.`);
            },
        );
    }

    //#endregion

    //#region ---USER---

    /**
     * Fetches the user whose portfolio the request belongs to.
     *
     * @param userId The user ID of a requested portfolio
     */
    public fetchUserInfo(userId: string): Observable<FrontendUser> {
        return this.handleResponse(
            this.http.get<FrontendUser>(`${this.baseUrl}/user/get-user-info/${userId}`, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    /**
     * Sends a request to change a user's email.
     *
     * @param newEmail The requested new email and current password.
     */
    public changeEmail(newEmail: ChangeEmail): Observable<FrontendUser> {
        return this.handleResponse(
            this.http.patch<FrontendUser>(`${this.baseUrl}/user/change-email`, newEmail, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(err.error.message);
            },
        );
    }

    /**
     * Sends a request to change a user's username.
     *
     * @param newUsername The reuqested new username and current password.
     */
    public changeUsername(newUsername: ChangeUsername): Observable<FrontendUser> {
        return this.handleResponse(
            this.http.patch<FrontendUser>(`${this.baseUrl}/user/change-username`, newUsername, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(err.error.message);
            },
        );
    }

    /**
     * Sends a request to change a user's password.
     *
     * @param newPasswordInfo The new password requested
     */
    public changePassword(newPasswordInfo: ChangePassword): Observable<FrontendUser> {
        return this.handleResponse(
            this.http.patch<FrontendUser>(`${this.baseUrl}/user/change-password`, newPasswordInfo, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(err.error.message);
            },
        );
    }

    /**
     * Sends a request to change a user's profile.
     *
     * @param newProfileInfo The new profile info requested
     */
    public changeProfile(newProfileInfo: ChangeProfile): Observable<FrontendUser> {
        return this.handleResponse(
            this.http.patch<FrontendUser>(`${this.baseUrl}/user/update-profile`, newProfileInfo, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(err.error.message);
            },
        );
    }

    /**
     * Sends a message to the server instructing it to set the user's
     * 'agreedToPolicies' field to true. On success, returns the updated
     * user object.
     */
    public agreeToPolicies(): Observable<FrontendUser> {
        return this.handleResponse(
            this.http.post<FrontendUser>(`${this.baseUrl}/user/agree-to-policies`, null, {
                observe: 'response',
                withCredentials: true,
            }),
            null,
            (err) => {
                //this.snackBar.open(err.error.message);
            },
        );
    }

    /**
     * Updates a user's tagline.
     *
     * @param tagline The new tagline
     */
    public updateTagline(tagline: UpdateTagline): Observable<FrontendUser> {
        return this.handleResponse(
            this.http.patch<FrontendUser>(`${this.baseUrl}/user/update-tagline`, tagline, {
                observe: 'response',
                withCredentials: true,
            }),
        );
    }

    //#endregion
}
