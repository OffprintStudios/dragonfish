import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

import { PoetryContent, CreatePoetry } from '@pulp-fiction/models/content';
import { HttpError } from '../../models/site';

@Injectable({
  providedIn: 'root'
})
export class PoetryService {
  private url = `/api/content/poetry`;

  constructor(private http: HttpClient) { }

  public createPoetry(poetryInfo: CreatePoetry) {
    return this.http.put<PoetryContent>(`${this.url}/create-poetry`, poetryInfo, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  public editPoetry(contentId: string, poetryInfo: CreatePoetry) {
    return this.http.patch<PoetryContent>(`${this.url}/edit-poetry?contentId=${contentId}`, poetryInfo, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  public uploadCoverart(uploader: FileUploader) {
    return new Observable<void>(observer => {
      uploader.onCompleteItem = (_: FileItem, response: string, status: number, __: ParsedResponseHeaders) => {

        if (status !== 201) {
          const errorMessage: HttpError = this.tryParseJsonHttpError(response);
          if (!errorMessage) {
            const juryRiggedError: HttpError = {
              statusCode: status, 
              error: response
            };
            return observer.error(juryRiggedError);
          } else  {
            return observer.error(errorMessage);
          }
        }
        
        // If we ever need to retun the modified work, the return type on this
        // should change to Observable<models.Work>, and we'd need to JSON parse
        // the response and return it in .next() here.
        observer.next()
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
