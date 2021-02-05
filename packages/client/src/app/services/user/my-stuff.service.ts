import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { BlogsContentModel, ContentKind, ContentModel, PoetryContent, ProseContent } from '@dragonfish/models/content';

@Injectable({
    providedIn: 'root',
})
export class MyStuffService {
    private url = `${environment.apiUrl}/api/content`;

    constructor(private http: HttpClient) {}

    public fetchAll() {
        return this.http
            .get<ContentModel[]>(`${this.url}/fetch-all`, { observe: 'response', withCredentials: true })
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }

    public fetchOne(contentId: string, kind: ContentKind) {
        if (kind === ContentKind.BlogContent) {
            return this.http
                .get<BlogsContentModel>(`${this.url}/fetch-one?contentId=${contentId}&kind=${kind}`, {
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
        } else if (kind === ContentKind.ProseContent) {
            return this.http
                .get<ProseContent>(`${this.url}/fetch-one?contentId=${contentId}&kind=${kind}`, {
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
        } else if (kind === ContentKind.PoetryContent) {
            return this.http
                .get<PoetryContent>(`${this.url}/fetch-one?contentId=${contentId}&kind=${kind}`, {
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
    }

    public deleteOne(contentId: string) {
        return this.http
            .patch(`${this.url}/delete-one?contentId=${contentId}`, {}, { observe: 'response', withCredentials: true })
            .pipe(
                map(() => {
                    return;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }

    public publishOne(contentId: string) {
        return this.http
            .patch(`${this.url}/publish-one?contentId=${contentId}`, {}, { observe: 'response', withCredentials: true })
            .pipe(
                map(() => {
                    return;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }
}
