import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MyStuffState } from './my-stuff.state';
import { MyStuffStore } from './my-stuff.store';
import { ContentModel } from '@dragonfish/shared/models/content';

@Injectable({ providedIn: 'root' })
export class MyStuffQuery extends QueryEntity<MyStuffState> {
    public loading$ = this.selectLoading();
    public all$ = this.selectAll();
    public current$ = this.selectActive<ContentModel>();

    constructor(protected store: MyStuffStore) {
        super(store);
    }
}
