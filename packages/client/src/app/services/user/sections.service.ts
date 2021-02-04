import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PublishSection, Section, SectionForm } from '@dragonfish/models/sections';
import { PoetryContent, ProseContent } from '@dragonfish/models/content';

@Injectable({
    providedIn: 'root',
})
export class SectionsService {
    private url = `/api/content/sections`;
    public myWork: PoetryContent | ProseContent;
    public mySections: Section[];

    constructor(private http: HttpClient) {}

    public fetchUserContentSections(contentId: string) {
        return this.http
            .get<Section[]>(`${this.url}/fetch-user-content-sections?contentId=${contentId}`, {
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

    public createSection(contentId: string, sectionInfo: SectionForm) {
        return this.http
            .put<Section>(`${this.url}/create-section?contentId=${contentId}`, sectionInfo, {
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

    public editSection(contentId: string, sectionId: string, sectionInfo: SectionForm) {
        return this.http
            .patch<Section>(`${this.url}/edit-section?contentId=${contentId}&sectionId=${sectionId}`, sectionInfo, {
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

    public deleteSection(contentId: string, sectionId: string) {
        return this.http
            .patch<Section>(
                `${this.url}/delete-section?contentId=${contentId}&sectionId=${sectionId}`,
                {},
                { observe: 'response', withCredentials: true },
            )
            .pipe(
                map((res) => {
                    return res.body;
                }),
                catchError((err) => {
                    return throwError(err);
                }),
            );
    }

    public publishSection(contentId: string, sectionId: string, pubStatus: PublishSection) {
        return this.http
            .patch<Section>(`${this.url}/publish-section?contentId=${contentId}&sectionId=${sectionId}`, pubStatus, {
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
