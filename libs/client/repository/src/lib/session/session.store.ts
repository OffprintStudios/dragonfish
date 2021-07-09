import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { SessionState, createInitialState } from './session.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {
    constructor() {
        super(createInitialState())
    }
}
