import { Injectable } from '@angular/core';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { ContentKind, FormType } from '@dragonfish/shared/models/content';
import { AppQuery } from '../../app';
import { ProfileRepository } from '../profile.repository';
import { tap } from 'rxjs/operators';
import { PseudonymsQuery } from '../../pseudonyms';
import { UserWorksStore } from './user-works.store';
import { UserWorksQuery } from './user-works.query';

@Injectable({ providedIn: 'root' })
export class UserWorksService {
    constructor(
        private userWorksStore: UserWorksStore,
        private userWorksQuery: UserWorksQuery,
        private appQuery: AppQuery,
        private profile: ProfileRepository,
        private pseudQuery: PseudonymsQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public getPage(page: number, publishedOnly: boolean) {
        if (publishedOnly) {
            return this.network
                .fetchAllContent(
                    page,
                    [ContentKind.ProseContent, ContentKind.PoetryContent],
                    this.appQuery.filter,
                    this.profile.profileId,
                )
                .pipe(
                    tap((content) => {
                        this.userWorksStore.set(content.docs);
                        this.userWorksStore.update({
                            currPage: page,
                            totalWorks: content.totalDocs,
                            perPage: content.limit,
                            totalPages: content.totalPages,
                        });
                    }),
                );
        } else {
            return this.network
                .fetchAllByKind(this.pseudQuery.currentId, [ContentKind.ProseContent, ContentKind.PoetryContent])
                .pipe(
                    tap((content) => {
                        this.userWorksStore.set(content.docs);
                        this.userWorksStore.update({
                            currPage: page,
                            totalWorks: content.totalDocs,
                            perPage: content.limit,
                            totalPages: content.totalPages,
                        });
                    }),
                );
        }
    }

    //#region ---CRUD OPERATIONS--

    public create(kind: ContentKind, formInfo: FormType) {
        return this.network.createContent(this.pseudQuery.currentId, kind, formInfo).pipe(
            tap((content) => {
                if (this.userWorksQuery.totalWorks === 0) {
                    this.userWorksStore.set([content]);
                    this.userWorksStore.update({
                        totalWorks: 1,
                    });
                } else {
                    this.userWorksStore.add(content, { prepend: true });
                }
                this.alerts.success(`Work created successfully!`);
            }),
        );
    }

    //#endregion
}
