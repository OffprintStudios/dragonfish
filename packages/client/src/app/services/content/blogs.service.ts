import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as models from '@pulp-fiction/models/blogs';
import { PaginateResult } from '@pulp-fiction/models/util';
import { AlertsService } from '../../modules/alerts';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  private url: string = `/api/content/blogs`;

  constructor(private http: HttpClient, private alertsService: AlertsService, private router: Router) {}

  /**
   * Sends the requisite blog info to the backend so that a new blog
   * can be created.
   *
   * @param info The blog's information.
   */
  public createBlog(info: models.CreateBlog) {
    return this.http.put<models.Blog>(`${this.url}/create-blog`, info, {observe: 'response', withCredentials: true})
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
  public fetchUserBlogs(pageNum: number) {
    return this.http.get<PaginateResult<models.Blog>>(`${this.url}/fetch-user-blogs/${pageNum}`, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        console.log(res.body);
        return res.body;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  /**
   * Deletes a user's blog based on the specified Blog ID.
   * 
   * @param blogId The ID of the blog we're deleting
   */
  public deleteBlog(blogId: string) {
    return this.http.patch(`${this.url}/delete-blog`, {blogId}, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        if (res.status === 200) {
          this.alertsService.success('Blog successfully deleted.');
        }
      }), catchError(err => {
        return throwError(err);
      }));
  }

  /**
   * Changes the publishing status of the specified blog.
   * 
   * @param blogId The ID of the blog we're changing status on
   */
  public setPublishStatus(publishStatus: models.SetPublishStatus) {
    return this.http.patch(`${this.url}/set-publish-status`, publishStatus, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        if (res.status === 200) {
          this.alertsService.success('Blog status updated.');
        }
      }), catchError(err => {
        return throwError(err);
      }));
  }

  /**
   * Sends information to the backend so the requisite blog can be updated.
   * 
   * @param blogInfo The updated blog info
   */
  public editBlog(blogInfo: models.EditBlog) {
    return this.http.patch(`${this.url}/edit-blog`, blogInfo, {observe: 'response', withCredentials: true})
      .pipe(map(res => {
        if (res.status === 200) {
          this.alertsService.success('Changes saved successfully.');
        }
      }), catchError(err => {
        return throwError(err);
      }));
  }
}
