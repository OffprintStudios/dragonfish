import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { InitialResults } from './models';
import { AlertsService } from '../../modules/alerts';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url: string = `/api/search`

  constructor(private http: HttpClient, private alertsService: AlertsService) { }
  
  public getInitialResults(query: string) {
    return this.http.get<InitialResults>(`${this.url}/get-initial-results?query=${query}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        return res.body;
      }), catchError(err => {
        this.alertsService.error(`Something went wrong! Try again in a little bit.`);
        return throwError(err);
      }));
  }
}
