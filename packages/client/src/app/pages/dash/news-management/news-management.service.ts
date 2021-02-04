import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { PaginateResult } from '@dragonfish/models/util';
import { NewsContentModel, NewsForm, PubStatus } from '@dragonfish/models/content';

@Injectable({
    providedIn: 'root',
})
export class NewsManagementService {
    private url = `/api/dashboard/news`;

    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    /**
     * Creates and saves a new newspost to the database.
     *
     * @param form A newspost's info
     */
    public createNewspost(form: NewsForm) {
        return this.http
            .put<NewsContentModel>(`${this.url}/create-post`, form, { observe: 'response', withCredentials: true })
            .pipe(
                map((_res) => {
                    this.snackBar.open(`Post created successfully!`);
                    return;
                }),
                catchError((err) => {
                    this.snackBar.open(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Submits edits on a newspost to the database.
     *
     * @param form A newspost's info
     */
    public editNewspost(postId: string, form: NewsForm) {
        return this.http
            .patch<NewsContentModel>(`${this.url}/edit-post/${postId}`, form, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((_res) => {
                    this.snackBar.open(`Changed saved!`);
                    return;
                }),
                catchError((err) => {
                    this.snackBar.open(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Fetches all newsposts
     */
    public fetchAll(pageNum: number) {
        return this.http
            .get<PaginateResult<NewsContentModel>>(`${this.url}/fetch-all/${pageNum}`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    this.snackBar.open(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Fetches a post for editing.
     *
     * @param postId The post to fetch
     */
    public fetchForEdit(postId: string) {
        return this.http
            .get<NewsContentModel>(`${this.url}/fetch-for-edit/${postId}`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    this.snackBar.open(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Changes the pubStatus of a post.
     *
     * @param postId The post to publish/unpublish
     * @param pubStatus The pubstatus to change to
     */
    public setPublishStatus(postId: string, pubStatus: PubStatus) {
        return this.http
            .patch<NewsContentModel>(
                `${this.url}/set-publish-status/${postId}`,
                { pubStatus },
                { observe: 'response', withCredentials: true },
            )
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    this.snackBar.open(err.error.message);
                    return throwError(err);
                }),
            );
    }
}
