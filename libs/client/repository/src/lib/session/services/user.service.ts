import { Injectable } from '@angular/core';
import { SessionStore } from '@dragonfish/client/repository/session';
import { SessionQuery } from '@dragonfish/client/repository/session/session.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import {
    ChangeBio,
    ChangeEmail,
    ChangePassword,
    ChangeUsername,
    FrontendUser,
    UpdateTagline,
} from '@dragonfish/shared/models/users';
import { catchError, tap } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload';
import { HttpError } from '@dragonfish/shared/models/util';
import { throwError } from 'rxjs';
import { PortfolioService } from '@dragonfish/client/repository/portfolio';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private sessionStore: SessionStore,
        private sessionQuery: SessionQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
        private portService: PortfolioService,
    ) {}

    /**
     * Changes a user's email.
     * @param payload
     */
    public changeEmail(payload: ChangeEmail) {
        return this.network.changeEmail(payload).pipe(
            tap((result: FrontendUser) => {
                this.sessionStore.update({
                    currentUser: result,
                });
                this.alerts.success(`Changes saved!`);
            }),
        );
    }

    /**
     * Changes a user's username.
     * @param payload
     */
    public changeUsername(payload: ChangeUsername) {
        this.alerts.info(`This action does nothing right now. Check back for a future update!`);
    }

    /**
     * Changes a user's password.
     * @param payload
     */
    public changePassword(payload: ChangePassword) {
        return this.network.changePassword(payload).pipe(
            tap((result: FrontendUser) => {
                this.sessionStore.update({
                    currentUser: result,
                });
                this.alerts.success(`Changes saved!`);
            }),
        );
    }

    /**
     * Changes a user's bio.
     * @param payload
     */
    public changeBio(payload: ChangeBio) {
        return this.network.changeBio(payload).pipe(
            tap((result: FrontendUser) => {
                this.sessionStore.update({
                    currentUser: result,
                });
                this.alerts.success(`Changes saved!`);
            }),
        );
    }

    /**
     * Sets the `termsAgree` flag on a user's document to `true`.
     */
    public agreeToPolicies() {
        return this.network.agreeToPolicies().pipe(
            tap((result: FrontendUser) => {
                this.sessionStore.update({
                    currentUser: result,
                });
                this.alerts.success(`Changes saved!`);
            }),
        );
    }

    /**
     * Uploads a user's new avatar.
     * @param payload
     */
    public changeAvatar(payload: FileUploader) {
        return this.network.changeImage(payload).pipe(
            tap((result: FrontendUser) => {
                this.sessionStore.update({
                    currentUser: result,
                });
                this.alerts.success(`Changes saved!`);
            }),
            catchError((error: HttpError) => {
                this.alerts.error(
                    `Uh-oh! Failed to upload your avatar. ${error.message} (HTTP ${error.statusCode} ${error.error})`,
                );
                return throwError(error);
            }),
        );
    }

    /**
     * Uploads a user's new profile cover pic.
     * @param payload
     */
    public changeProfileCover(payload: FileUploader) {
        return this.network.changeImage(payload).pipe(
            tap((result: FrontendUser) => {
                this.sessionStore.update({
                    currentUser: result,
                });
                this.alerts.success(`Changes saved!`);
                this.portService.updatePortfolio(result);
            }),
            catchError((error: HttpError) => {
                this.alerts.error(
                    `Uh-oh! Failed to upload your cover pic. ${error.message} (HTTP ${error.statusCode} ${error.error})`,
                );
                return throwError(error);
            }),
        );
    }

    /**
     * Updates a user's tagline.
     * @param payload
     */
    public updateTagline(payload: UpdateTagline) {
        return this.network.updateTagline(payload).pipe(
            tap((result: FrontendUser) => {
                this.sessionStore.update({
                    currentUser: result,
                });
                this.alerts.success(`Changes saved!`);
            }),
        );
    }
}
