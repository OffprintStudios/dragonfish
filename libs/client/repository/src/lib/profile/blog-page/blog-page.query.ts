import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { BlogPageState } from './blog-page.state';
import { BlogPageStore } from './blog-page.store';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Injectable({ providedIn: 'root' })
export class BlogPageQuery extends Query<BlogPageState> {
    public blog$ = this.select('blog');

    constructor(protected store: BlogPageStore) {
        super(store);
    }

    public get author() {
        return this.getValue().blog.author as Pseudonym;
    }
}
