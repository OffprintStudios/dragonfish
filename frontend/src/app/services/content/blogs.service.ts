import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as models from 'src/app/models/blogs';
import { AlertsService } from 'src/app/modules/alerts';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  constructor(private http: HttpClient, private alertsService: AlertsService, private router: Router) {}

  /**
   * Sends the requisite blog info to the backend so that a new blog
   * can be created.
   *
   * @param info The blog's information.
   */
  public createBlog(info: models.CreateBlog) {
    return this.http.put<models.Blog>(`/api/blogs/create-blog`, info, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        if (res.status === 201) {
          this.alertsService.success('Blog successfully created.');
        }
      }), catchError(err => {
        return throwError(err);
      }));
  }

  /**
   * Fetches a user's blogs for display in the blog management section
   * of the home page.
   */
  public fetchUserBlogs() {
    return this.http.get<models.Blog[]>(`/api/blogs/fetch-user-blogs`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        if (res.status === 200) {
          return res.body;
        }
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
