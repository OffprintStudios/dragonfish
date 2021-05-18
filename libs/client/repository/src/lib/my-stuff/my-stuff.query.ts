import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MyStuffState } from './my-stuff.state';
import { MyStuffStore } from './my-stuff.store';

@Injectable({ providedIn: 'root' })
export class MyStuffQuery extends QueryEntity<MyStuffState> {
    public loading$ = this.selectLoading();
    public allContent$ = this.selectAll();

    constructor(protected store: MyStuffStore) {
        super(store);
    }
}
