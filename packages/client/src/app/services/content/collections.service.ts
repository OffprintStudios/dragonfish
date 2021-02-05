import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { AlertsService } from '../../shared/alerts';
import { Collection, CollectionForm } from '@dragonfish/models/collections';
import { PaginateResult } from '@dragonfish/models/util';

@Injectable({
    providedIn: 'root',
})
export class CollectionsService {
    private url = `${environment.apiUrl}/api/content/collections`;
    public thisUsersCollections: Collection[];

    constructor(private http: HttpClient, private alertsService: AlertsService) {}

    /**
     * Creates a collection in the database.
     *
     * @param collInfo A collection's info
     */
    public createCollection(collInfo: CollectionForm) {
        return this.http
            .put<void>(`${this.url}/create-collection`, collInfo, { observe: 'response', withCredentials: true })
            .pipe(
                map(() => {
                    this.alertsService.success(`Collection successfully created.`);
                    return;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Fetches a user's collections.
     */
    public getAllCollections(pageNum: number) {
        return this.http
            .get<PaginateResult<Collection>>(`${this.url}/get-all-collections?pageNum=${pageNum}`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((colls) => {
                    return colls.body;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    public getOneCollection(collId: string) {
        return this.http
            .get<Collection>(`${this.url}/get-one-collection?collId=${collId}`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((coll) => {
                    return coll.body;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    public getOnePublicCollection(userId: string, collId: string) {
        return this.http
            .get<Collection>(`${this.url}/get-one-public-collection?userId=${userId}&collId=${collId}`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    public getPublicCollections(userId: string, pageNum: number) {
        return this.http
            .get<PaginateResult<Collection>>(`${this.url}/get-public-collections?userId=${userId}&pageNum=${pageNum}`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((colls) => {
                    return colls.body;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Fetches a user's collections without pagination.
     */
    public getAllCollectionsNoPaginate() {
        return this.http
            .get<Collection[]>(`${this.url}/get-all-collections-no-paginate`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((colls) => {
                    return colls.body;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sends edits for a collection to the database.
     *
     * @param collId A collection's ID
     * @param collInfo The new collection info
     */
    public editCollection(collId: string, collInfo: CollectionForm) {
        return this.http
            .patch<void>(`${this.url}/edit-collection?collId=${collId}`, collInfo, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map(() => {
                    this.alertsService.success(`Edits saved successfully.`);
                    return;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Deletes a collection belonging to this user.
     *
     * @param collId The collection ID
     */
    public deleteCollection(collId: string) {
        return this.http
            .patch<void>(
                `${this.url}/delete-collection?collId=${collId}`,
                {},
                { observe: 'response', withCredentials: true },
            )
            .pipe(
                map(() => {
                    this.alertsService.success(`Collection deleted successfully.`);
                    return;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Adds a work to a collection.
     *
     * @param collId The collection
     * @param workId The work
     */
    public addWork(collId: string, workId: string) {
        return this.http
            .patch<void>(
                `${this.url}/add-content?collId=${collId}&contentId=${workId}`,
                {},
                { observe: 'response', withCredentials: true },
            )
            .pipe(
                map(() => {
                    this.alertsService.success(`Work added to collection.`);
                    return;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Removes a work from a collection.
     *
     * @param collId The collection
     * @param workId The work
     */
    public removeWork(collId: string, workId: string) {
        return this.http
            .patch<void>(
                `${this.url}/remove-content?collId=${collId}&contentId=${workId}`,
                {},
                { observe: 'response', withCredentials: true },
            )
            .pipe(
                map(() => {
                    this.alertsService.success(`Work removed from collection.`);
                    return;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sends a request to set a collection to public to the backend.
     *
     * @param collId The collection's ID
     */
    public setToPublic(collId: string) {
        return this.http
            .patch<void>(`${this.url}/set-public?collId=${collId}`, {}, { observe: 'response', withCredentials: true })
            .pipe(
                map(() => {
                    return;
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sends a request to set a collection to private to the backend.
     *
     * @param collId The collection's ID
     */
    public setToPrivate(collId: string) {
        return this.http
            .patch<void>(`${this.url}/set-private?collId=${collId}`, {}, { observe: 'response', withCredentials: true })
            .pipe(
                map(() => {
                    return;
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }
}
