import { Injectable } from '@angular/core';
import { Store, createState, withProps, select } from '@ngneat/elf';
import { Pseudonym } from '@dragonfish/shared/models/accounts';
import { ContentModel } from '@dragonfish/shared/models/content';
import { Subscription } from '@dragonfish/shared/models/accounts/notifications';
import { map, Observable, of, throwError, zip } from 'rxjs';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { AppQuery } from '../app';
import { catchError, tap } from 'rxjs/operators';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';
import { SessionQuery } from '@dragonfish/client/repository/session';

interface ProfileProps {
    currProfile: Pseudonym;
    homeWorks: ContentModel[];
    homeBlogs: ContentModel[];
    isFollowing: Subscription;
}

const { state, config } = createState(
    withProps<ProfileProps>({ currProfile: null, homeWorks: [], homeBlogs: [], isFollowing: null }),
);

const store = new Store({ state, name: 'profile', config });

@Injectable({ providedIn: 'root' })
export class ProfileRepository {
    public profile$: Observable<Pseudonym> = store.pipe(select((state) => state.currProfile));
    public works$: Observable<ContentModel[]> = store.pipe(select((state) => state.homeWorks));
    public blogs$: Observable<ContentModel[]> = store.pipe(select((state) => state.homeBlogs));
    public isFollowing$: Observable<boolean> = store.pipe(select((state) => !!state.isFollowing));

    constructor(
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
        private app: AppQuery,
        private pseud: PseudonymsQuery,
        private session: SessionQuery,
    ) {}

    public setProfile(profileId: string) {
        if (this.session.isLoggedIn && this.pseud.current) {
            return zip(
                this.network.getProfile(profileId),
                this.network.getProfileContent(profileId, this.app.filter),
                this.network.checkIfFollowing(this.pseud.currentId, profileId),
            ).pipe(
                tap((result) => {
                    const [profile, content, following] = result;
                    store.update((state) => ({
                        ...state,
                        currProfile: profile,
                        homeWorks: content.works,
                        homeBlogs: content.blogs,
                        isFollowing: following,
                    }));
                }),
                map(() => {
                    return;
                }),
                catchError((err) => {
                    this.alerts.error(err.error.message);
                    return throwError(err);
                }),
            );
        } else {
            return zip(
                this.network.getProfile(profileId),
                this.network.getProfileContent(profileId, this.app.filter),
                of(null),
            ).pipe(
                tap((result) => {
                    const [profile, content, following] = result;
                    store.update((state) => ({
                        ...state,
                        currProfile: profile,
                        homeWorks: content.works,
                        homeBlogs: content.blogs,
                        isFollowing: following,
                    }));
                }),
                map(() => {
                    return;
                }),
            );
        }
    }

    //#region ---FOLLOWERS---

    public followUser() {
        return this.network.followUser(this.pseud.currentId, this.profileId).pipe(
            tap((result) => {
                store.update((state) => ({
                    ...state,
                    isFollowing: result,
                }));
            }),
            map(() => {
                return;
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    public unfollowUser() {
        return this.network.unfollowUser(this.pseud.currentId, this.profileId).pipe(
            tap(() => {
                store.update((state) => ({
                    ...state,
                    isFollowing: null,
                }));
            }),
            map(() => {
                return;
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(err);
            }),
        );
    }

    //#endregion

    //#region ---GETTERS---

    public get screenName() {
        return store.getValue().currProfile.screenName;
    }

    public get userTag() {
        return store.getValue().currProfile.userTag;
    }

    public get profileId() {
        return store.getValue().currProfile._id;
    }

    public get isFollowing() {
        return !!store.getValue().isFollowing;
    }

    //#endregion
}
