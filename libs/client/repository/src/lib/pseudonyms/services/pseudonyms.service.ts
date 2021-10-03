import { Injectable } from '@angular/core';
import { PseudonymsStore } from '../pseudonyms.store';
import { ChangeBio, ChangeScreenName, ChangeTagline, Pseudonym } from '@dragonfish/shared/models/accounts';
import { catchError, tap } from 'rxjs/operators';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { PseudonymsQuery } from '../pseudonyms.query';
import { AlertsService } from '@dragonfish/client/alerts';
import { FileUploader } from 'ng2-file-upload';
import { HttpError } from '@dragonfish/shared/models/util';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PseudonymsService {
    constructor(
        private pseudStore: PseudonymsStore,
        private pseudQuery: PseudonymsQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

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

    public changeScreenName(formInfo: ChangeScreenName) {
        return this.network.changeScreenName(this.pseudQuery.currentId, formInfo).pipe(
            tap((result: Pseudonym) => {
                this.pseudStore.update(result._id, result);
                this.alerts.success(`Changes saved!`);
            }),
        );
    }

    public changeBio(formInfo: ChangeBio) {
        return this.network.changeBio(this.pseudQuery.currentId, formInfo).pipe(
            tap((result: Pseudonym) => {
                this.pseudStore.update(result._id, result);
                this.alerts.success(`Changes saved!`);
            }),
        );
    }

    public changeTagline(formInfo: ChangeTagline) {
        return this.network.changeTagline(this.pseudQuery.currentId, formInfo).pipe(
            tap((result: Pseudonym) => {
                this.pseudStore.update(result._id, result);
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
            tap((result: Pseudonym) => {
                this.pseudStore.update(result._id, result);
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
            tap((result: Pseudonym) => {
                this.pseudStore.update(result._id, result);
                this.alerts.success(`Changes saved!`);
                //this.portService.updatePortfolio(result);
            }),
            catchError((error: HttpError) => {
                this.alerts.error(
                    `Uh-oh! Failed to upload your cover pic. ${error.message} (HTTP ${error.statusCode} ${error.error})`,
                );
                return throwError(error);
            }),
        );
    }
}
