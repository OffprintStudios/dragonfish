import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

import { ContentModel, ContentKind, CreateProse, 
    BlogForm, CreatePoetry, NewsForm, PubChange } from '@dragonfish/models/content';
import { HttpError } from '../../../models/site';
import { PublishSection, Section, SectionForm } from '@dragonfish/models/sections';

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
     * Fetches the sections belonging to the specified piece of content given its ID.
     * 
     * @param contentId The content ID
     */
    public fetchSections(contentId: string): Observable<Section[]> {
        return this.http.get<Section[]>(`${this.url}/sections/fetch-user-content-sections?contentId=${contentId}`, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }

    /**
     * Sends a request to create a new section for the specified piece of content, given the content's ID
     * and the new section info.
     * 
     * @param contentId The content ID
     * @param sectionInfo The info for the new section
     */
    public createSection(contentId: string, sectionInfo: SectionForm): Observable<Section> {
        return this.http.put<Section>(`${this.url}/sections/create-section?contentId=${contentId}`, sectionInfo, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }
    
    /**
     * Sends a request to save any edits to the specified section, belonging to the specified content.
     * 
     * @param contentId The content ID
     * @param sectionId The section ID
     * @param sectionInfo The info to save
     */
    public editSection(contentId: string, sectionId: string, sectionInfo: SectionForm): Observable<Section> {
        return this.http.patch<Section>(`${this.url}/sections/edit-section?contentId=${contentId}&sectionId=${sectionId}`, sectionInfo, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }
    
    /**
     * Sends a request to delete the specified section, belonging to the specified content.
     * 
     * @param contentId The content ID
     * @param sectionId The section ID
     */
    public deleteSection(contentId: string, sectionId: string): Observable<Section> {
        return this.http.patch<Section>(`${this.url}/sections/delete-section?contentId=${contentId}&sectionId=${sectionId}`, {}, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
    }
    
    /**
     * Sends a request to flip the current publishing status of the specified section.
     * 
     * @param contentId The content ID
     * @param sectionId The section ID
     * @param pubStatus The publishing status
     */
    public publishSection(contentId: string, sectionId: string, pubStatus: PublishSection): Observable<Section> {
        return this.http.patch<Section>(`${this.url}/sections/publish-section?contentId=${contentId}&sectionId=${sectionId}`, pubStatus, {observe: 'response', withCredentials: true})
            .pipe(map(res => {
                return res.body;
            }), catchError(err => {
                return throwError(err);
            }));
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