import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { InitialResults, PaginateResult } from '@dragonfish/models/util';
import { User } from '@dragonfish/models/users';
import { BlogsContentModel, ContentModel } from '@dragonfish/models/content';
import { NetworkService } from '../network.service';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    private url = `${environment.apiUrl}/api/search`;

    workResults: Observable<PaginateResult<ContentModel>>;
    blogResults: Observable<PaginateResult<BlogsContentModel>>;
    userResults: Observable<PaginateResult<User>>;

    constructor(private readonly networkService: NetworkService) {}

    /**
     * Search for the given query, and return the top 3 results in Works, Blogs, and Users.
     * @param query The user's search string.
     */
    public fetchInitialResults(query: string): Observable<InitialResults> {
        return this.networkService.searchInitialResults(query);
    }

    public fetchWorks(query: string, pageNum: number): Observable<PaginateResult<ContentModel>> {
        return this.networkService.searchWorks(query, pageNum);
    }

    public fetchBlogs(query: string, pageNum: number): Observable<PaginateResult<ContentModel>> {
        return this.networkService.searchBlogs(query, pageNum);
    }

    public fetchUsers(query: string, pageNum: number): Observable<PaginateResult<User>> {
        return this.networkService.searchUsers(query, pageNum);
    }
}
