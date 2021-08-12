import { Injectable } from '@angular/core';
import { PseudonymsStore } from '../pseudonyms.store';
import { Pseudonym } from '@dragonfish/shared/models/accounts';

@Injectable({ providedIn: 'root' })
export class PseudonymsService {
    constructor(private pseudStore: PseudonymsStore) {}

    public setAll(pseudonyms: Pseudonym[]) {
        this.pseudStore.set(pseudonyms);
    }

    public setActive(id: string) {
        this.pseudStore.setActive(id);
    }

    public deselect() {
        this.pseudStore.setActive(null);
    }

    public addOne(pseudonym: Pseudonym) {
        this.pseudStore.add(pseudonym);
    }

    public clearAll() {
        this.pseudStore.setActive(null);
        this.pseudStore.remove();
    }
}
