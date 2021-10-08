import { Injectable } from '@angular/core';
import { SessionStore } from '../session.store';
import { SessionQuery } from '../session.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { ChangeEmail, ChangePassword } from '@dragonfish/shared/models/users';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private sessionStore: SessionStore,
        private sessionQuery: SessionQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    /**
     * Changes a user's email.
     * @param payload
     */
    public changeEmail(payload: ChangeEmail) {
        this.alerts.info(`This feature is not currently supported!`);
    }

    /**
     * Changes a user's password.
     * @param payload
     */
    public changePassword(payload: ChangePassword) {
        this.alerts.info(`This feature is not currently supported!`);
    }

    /**
     * Sets the `termsAgree` flag on a user's document to `true`.
     */
    public agreeToPolicies() {
        this.alerts.info(`This feature is not currently supported!`);
    }
}
