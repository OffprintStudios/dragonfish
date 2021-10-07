import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PseudonymsState } from './pseudonyms.state';
import { PseudonymsStore } from './pseudonyms.store';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Injectable({ providedIn: 'root' })
export class PseudonymsQuery extends QueryEntity<PseudonymsState> {
    public loading$ = this.selectLoading();
    public all$ = this.selectAll();
    public current$ = this.selectActive<Pseudonym>();

    constructor(protected store: PseudonymsStore) {
        super(store);
    }

    public get current() {
        return this.getActive();
    }

    public get currentId() {
        return this.getActive()._id;
    }

    public get currentCover() {
        if (this.getActive()) {
            return this.getActive().profile.coverPic;
        } else {
            return null;
        }
    }

    public get numPseuds() {
        return this.getValue().ids.length;
    }
}
