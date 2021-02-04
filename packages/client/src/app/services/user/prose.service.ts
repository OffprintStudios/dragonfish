import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

import { ProseContent, CreateProse } from '@dragonfish/models/content';
import { HttpError } from '../../models/site';

@Injectable({
    providedIn: 'root',
})
export class ProseService {
    private url = `/api/content/prose`;

    constructor(private http: HttpClient) {}

    public createProse(proseInfo: CreateProse) {
        return this.http
            .put<ProseContent>(`${this.url}/create-prose`, proseInfo, { observe: 'response', withCredentials: true })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }

    public editProse(contentId: string, proseInfo: CreateProse) {
        return this.http
            .patch<ProseContent>(`${this.url}/edit-prose?contentId=${contentId}`, proseInfo, {
                observe: 'response',
                withCredentials: true,
            })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }

    public uploadCoverart(uploader: FileUploader) {
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
