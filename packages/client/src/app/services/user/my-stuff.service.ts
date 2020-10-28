import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Types } from 'mongoose';
import { BlogsContentModel, ContentKind, ContentModel, Folder, FolderForm } from '@pulp-fiction/models/content';

@Injectable({
  providedIn: 'root'
})
export class MyStuffService {
  private url = `/api/content`;
  public currentFolderId: Types.ObjectId;

  constructor(private http: HttpClient) { }

  public fetchAll() {
    return this.http.get<ContentModel[]>(`${this.url}/fetch-all`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  public fetchOne(contentId: string, kind: ContentKind) {
    if (kind === ContentKind.BlogContent) {
      return this.http.get<BlogsContentModel>(`${this.url}/fetch-one?contentId=${contentId}&kind=${kind}`, {observe: 'response', withCredentials: true})
        .pipe(map(res => {
          return res.body;
        }), catchError(err => {
          return throwError(err);
        }));
    } else if (kind === ContentKind.WorkContent) {
      // fetch work
    }
  }

  public deleteOne(contentId: string) {
    return this.http.patch(`${this.url}/delete-one?contentId=${contentId}`, {}, {observe: 'response', withCredentials: true})
      .pipe(map(() => {
        return;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  public createFolder(folderInfo: FolderForm, parentId?: Types.ObjectId) {
    if (parentId) {
      return this.http.post<Folder>(`${this.url}/create-folder?parentId=${parentId}`, folderInfo, {observe: 'response', withCredentials: true})
        .pipe(map(res => {
          return res.body;
        }), catchError(err => {
          return throwError(err);
        }));
    } else {
      return this.http.post<Folder>(`${this.url}/create-folder`, folderInfo, {observe: 'response', withCredentials: true})
        .pipe(map(res => {
          return res.body;
        }), catchError(err => {
          return throwError(err);
        }));
    }
  }

  public editFolder(folderInfo: FolderForm, folderId: Types.ObjectId) {
    return this.http.patch<Folder>(`${this.url}/edit-folder?folderId=${folderId}`, folderInfo, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  public fetchTopFolders() {
    return this.http.get<Folder[]>(`${this.url}/fetch-top-folders`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  public fetchOneFolder(folderId: Types.ObjectId) {
    return this.http.get<Folder>(`${this.url}/fetch-one-folder?folderId=${folderId}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
