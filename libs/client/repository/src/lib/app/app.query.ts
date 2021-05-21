import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AppState } from './app.state';
import { AppStore } from './app.store';

@Injectable({ providedIn: 'root' })
export class AppQuery extends Query<AppState> {
    public theme$ = this.select('theme');
    public filter$ = this.select('filter');

    constructor(protected store: AppStore) {
        super(store);
    }

    public get filter() {
        return this.getValue().filter;
    }
}
