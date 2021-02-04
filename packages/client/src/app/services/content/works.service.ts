import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AlertsService } from '../../shared/alerts';
import { HttpError } from '../..//models/site';
import {
    CreateWork,
    CreateSection,
    EditSection,
    EditWork,
    Section,
    PublishSection,
    SectionInfo,
    Work,
    SetApprovalRating,
} from '@dragonfish/models/works';
import { PaginateResult } from '@dragonfish/models/util';

@Injectable({
    providedIn: 'root',
})
export class WorksService {
    private url: string = `/api/content/works`;

    public thisWorkId: string; // for cover art uploading

    constructor(private http: HttpClient, private alertsService: AlertsService, private router: Router) {}

    /**
     * Sends the requisite work info to the backend so that a new work can
     * be created.
     *
     * @param info The work's information
     */
    public createWork(info: CreateWork) {
        return this.http
            .put<Work>(`${this.url}/create-work`, info, { observe: 'response', withCredentials: true })
            .pipe(
                map((res) => {
                    if (res.status === 201) {
                        this.alertsService.success(`Work successfully created.`);
                    }
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }

    /**
     * Creates a section belonging to the specified work.
     *
     * @param workId The work the section belongs to
     * @param info The new section's information
     */
    public createSection(workId: string, info: CreateSection) {
        return this.http
            .put<Section>(`${this.url}/create-section/${workId}`, info, { observe: 'response', withCredentials: true })
            .pipe(
                map((res) => {
                    this.alertsService.success(`Section successfully created.`);
                    return res.body;
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }

    /**
     * Fetches a section belonging to the specified work for an author to view it.
     *
     * @param workId The work the section belongs to
     * @param sectionId The section itself
     */
    public getSectionForUser(workId: string, sectionId: string) {
        return this.http
            .get<Section>(`${this.url}/get-section-for-user/${workId}/${sectionId}`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((section) => {
                    return section.body;
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }

    /**
     * Fetches a user's works for display in the work management section of
     * the homepage.
     */
    public fetchUserWorks(pageNum: number) {
        return this.http
            .get<PaginateResult<Work>>(`${this.url}/fetch-user-works/${pageNum}`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((works) => {
                    return works.body;
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sends a request to the backend to delete the specified work using its ID.
     *
     * @param workId The work we're deleting
     */
    public deleteWork(workId: string) {
        return this.http
            .patch(`${this.url}/delete-work/${workId}`, {}, { observe: 'response', withCredentials: true })
            .pipe(
                map((res) => {
                    this.alertsService.success(`Work successfully deleted.`);
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sends a request to delete the specified section from the database.
     *
     * @param workId The work the section belongs to
     * @param sectionId The section itself
     */
    public deleteSection(workId: string, sectionId: string) {
        return this.http
            .patch(
                `${this.url}/delete-section/${workId}/${sectionId}`,
                {},
                { observe: 'response', withCredentials: true },
            )
            .pipe(
                map((res) => {
                    this.alertsService.success(`Section successfully deleted.`);
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }

    public submitForPublishing() {}

    /**
     * Sends a request to the backend to update work with the specified new information.
     *
     * @param workInfo The work we're editing
     */
    public editWork(workInfo: EditWork) {
        return this.http.patch(` ${this.url}/edit-work`, workInfo, { observe: 'response', withCredentials: true }).pipe(
            map((res) => {
                this.alertsService.success(`Changes saved successfully.`);
            }),
            catchError((err) => {
                this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                return throwError(err);
            }),
        );
    }

    /**
     * Fetches a work from the database using its ID.
     *
     * @param workId The work we're fetching
     */
    public fetchWork(workId: string): Observable<Work> {
        return this.http
            .get<Work>(`${this.url}/get-work/${workId}`, { observe: 'response', withCredentials: true })
            .pipe(
                map((work) => {
                    return work.body;
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sends the provided information to the backend to update the requisite section of
     * the specified work.
     *
     * @param workId The work this section belongs to
     * @param sectionId The section itself
     * @param sectionData The new information for the section
     */
    public editSection(workId: string, sectionId: string, sectionData: EditSection) {
        return this.http
            .patch(`${this.url}/edit-section/${workId}/${sectionId}`, sectionData, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map(() => {
                    this.alertsService.success(`Changes saved!`);
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sets the publishing status of the specified section, belonging to the specified work.
     *
     * @param workId The work this section belongs to
     * @param sectionId The section itself
     * @param pubStatus The new publishing status for this section
     */
    public setPublishStatusSection(workId: string, sectionId: string, pubStatus: PublishSection) {
        return this.http
            .patch(`${this.url}/set-publishing-status/${workId}/${sectionId}`, pubStatus, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map(() => {
                    if (pubStatus.newPub === true) {
                        this.alertsService.success(`Section published!`);
                    } else {
                        this.alertsService.success('Section unpublished!');
                    }
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }

    /**
     * Fetches a published section from the backend.
     *
     * @param workId The work this section belongs to
     * @param sectionId The section itself
     */
    public getPublishedSection(workId: string, sectionId: string) {
        return this.http
            .get<Section>(`${this.url}/fetch-section/${workId}/${sectionId}`, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((section) => {
                    return section.body;
                }),
                catchError((err) => {
                    this.alertsService.error(`Something went wrong! Try again in a little bit.`);
                    return throwError(err);
                }),
            );
    }

    /**
     * Uploads a user's avatar to the server for processing.
     *
     * @param uploader the file uploader
     */
    public changeCoverArt(uploader: FileUploader): Observable<void> {
        return new Observable<void>((observer) => {
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

                // If we ever need to retun the modified work, the return type on this
                // should change to Observable<models.Work>, and we'd need to JSON parse
                // the response and return it in .next() here.
                observer.next();
                observer.complete();
            };

            uploader.uploadAll();
        });
    }

    /**
     * Sets a user's rating to Liked.
     *
     * @param setRating Information to set the new rating
     */
    public setLike(setRating: SetApprovalRating) {
        return this.http
            .patch<void>(`${this.url}/set-like`, setRating, { observe: 'response', withCredentials: true })
            .pipe(
                map(() => {
                    return;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sets a user's rating to Disliked.
     *
     * @param setRating Information to set the new rating
     */
    public setDislike(setRating: SetApprovalRating) {
        return this.http
            .patch<void>(`${this.url}/set-dislike`, setRating, { observe: 'response', withCredentials: true })
            .pipe(
                map(() => {
                    return;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Sets a user's rating to NoVote.
     *
     * @param setRating Information to set the new rating
     */
    public setNoVote(setRating: SetApprovalRating) {
        return this.http
            .patch<void>(`${this.url}/set-no-vote`, setRating, { observe: 'response', withCredentials: true })
            .pipe(
                map(() => {
                    return;
                }),
                catchError((err) => {
                    this.alertsService.error(err.error.message);
                    return throwError(err);
                }),
            );
    }

    /**
     * Attempts to parse an HttpError.
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
}
