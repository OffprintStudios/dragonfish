import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MyStuffService {
  private url = `/api/content`;

  constructor(private http: HttpClient) { }

  public getContent() {
    return this.http.get(`${this.url}/fetch-many?pageNum=`)
  }
}
