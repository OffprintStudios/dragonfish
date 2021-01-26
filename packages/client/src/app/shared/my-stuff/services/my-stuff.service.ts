import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

import { ContentModel, ContentKind, CreateProse, 
    BlogForm, CreatePoetry, NewsForm, PubChange } from '@pulp-fiction/models/content';
import { HttpError } from '../../../models/site';

@Injectable({
    providedIn: 'root'
})
export class MyStuffService {
    private url = `/api/content`;

    constructor(private http: HttpClient) {}

    /**
     * Fetches one piece of content from the backend.
     * 
     * @param contentId The content to fetch
     * @param kind The content kind
     * @returns Observable
     */
    public fetchOne(contentId: string, kind: ContentKind): Observable<ContentModel> {
        return this.http.get<ContentModel>(`${this.url}/fetch-one?contentId=${contentId}&kind=${kind}`, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }

    /**
     * Fetches all files related to the current user from the backend.
     * 
     * @returns Observable
     */
    public fetchAll(): Observable<ContentModel[]> {
        return this.http.get<ContentModel[]>(`${this.url}/fetch-all`, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }

    /**
     * Sends a request to create a piece of content to the backend, with the route determined by its
     * `ContentKind`. 
     * 
     * @param kind The content kind
     * @param formInfo The form information
     */
    public createContent(kind: ContentKind, formInfo: CreateProse | CreatePoetry | BlogForm | NewsForm): Observable<ContentModel> {
        return this.http.put<ContentModel>(`${this.url}/create-one?kind=${kind}`, formInfo, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }

    /**
     * Sends a request to create a piece of content to the backend, with the route determined by its
     * `ContentKind`. 
     * 
     * @param kind The content kind
     * @param formInfo The form information
     */
    public saveContent(contentId: string, kind: ContentKind, formInfo: CreateProse | CreatePoetry | BlogForm | NewsForm): Observable<ContentModel> {
        return this.http.patch<ContentModel>(`${this.url}/save-changes?contentId=${contentId}&kind=${kind}`, formInfo, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }


    /**
     * Sends a request to delete the specified content.
     * 
     * @param contentId The content to delete
     * @returns Observable
     */
    public deleteOne(contentId: string): Observable<void> {
        return this.http.patch(`${this.url}/delete-one?contentId=${contentId}`, {}, {observe: 'response', withCredentials: true})
            .pipe(map(() => {
                return;
            }), catchError(err => {
                return throwError(err);
            }));
    }

    /**
     * Sends a request to publish the specified content.
     * 
     * @param contentId The content to publish
     * @param pubChange (Optional) Used for blog and newspost publishing changes
     * @returns Observable
     */
    public publishOne(contentId: string, pubChange?: PubChange): Observable<ContentModel> {
        return this.http.patch<ContentModel>(`${this.url}/publish-one?contentId=${contentId}`, pubChange, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }

    /**
     * Uploads cover art for Prose and Poetry.
     * 
     * @param uploader The file uploader
     * @returns Observable
     */
    public uploadCoverart(uploader: FileUploader): Observable<ContentModel> {
        return new Observable<ContentModel>(observer => {
            uploader.onCompleteItem = (_: FileItem, response: string, status: number, __: ParsedResponseHeaders) => {
                if (status !== 201) {
                    const errorMessage: HttpError = this.tryParseJsonHttpError(response);
                    if (!errorMessage) {
                        const juryRiggedError: HttpError = {
                            statusCode: status, 
                            error: response
                        };
                        return observer.error(juryRiggedError);
                    } else {
                        return observer.error(errorMessage);
                    }
                }
                // If we ever need to retun the modified work, the return type on this
                // should change to Observable<models.Work>, and we'd need to JSON parse
                // the response and return it in .next() here.
                observer.next(JSON.parse(response));
                observer.complete();
            };      
    
            uploader.uploadAll();
        });   
    }

    /**
     * Attempts to parse an HttpError.
     * 
     * @param response The response to parse
     * @returns HttpError | null
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