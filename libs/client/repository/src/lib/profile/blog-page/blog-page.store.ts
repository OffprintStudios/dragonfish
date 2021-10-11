import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { BlogPageState, createInitialState } from './blog-page.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'blog-page' })
export class BlogPageStore extends Store<BlogPageState> {
    constructor() {
        super(createInitialState());
    }
}
