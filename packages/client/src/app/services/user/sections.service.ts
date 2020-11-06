import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Section, SectionForm } from '@pulp-fiction/models/sections';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {
  private url = `/api/content/sections`;

  constructor(private http: HttpClient) { }

  public fetchUserContentSections(contentId: string) {
    return this.http.get<Section[]>(`${this.url}/fetch-user-content-sections?contentId=${contentId}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  public createSection(contentId: string, sectionInfo: SectionForm) {
    return this.http.put<Section>(`${this.url}/create-section?contentId=${contentId}`, sectionInfo, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
