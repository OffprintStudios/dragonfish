import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url: string = `/api/search`

  constructor() { }
}
