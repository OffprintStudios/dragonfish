import { Injectable } from '@angular/core';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { PseudonymsQuery } from '../pseudonyms';
import { ContentKind, ContentModel, FormType, PubContent } from '@dragonfish/shared/models/content';
import { WorkPageQuery } from './work-page.query';
import { WorkPageStore } from './work-page.store';
import { catchError, take, tap } from 'rxjs/operators';
import { AlertsService } from '@dragonfish/client/alerts';
import { of, throwError } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';
import { SectionsService } from './sections';
import { PublishSection, Section } from '@dragonfish/shared/models/sections';
import { RatingOption } from '@dragonfish/shared/models/reading-history';
import { ContentLibraryRepository } from '../content-library';
import { MIN_PROSE_LENGTH } from '@dragonfish/shared/constants/content-constants';

@Injectable({ providedIn: 'root' })
export class WorkPageService {
    constructor(
        private network: DragonfishNetworkService,
        private pseudQuery: PseudonymsQuery,
        private workQuery: WorkPageQuery,
        private workStore: WorkPageStore,
        private alerts: AlertsService,
        private router: Router,
        private sections: SectionsService,
        private library: ContentLibraryRepository,
    ) {}

    //#region ---FETCHING---

    public fetchContent(id: string) {
        if (this.pseudQuery.currentId) {
            return this.network.fetchOne(id, this.pseudQuery.currentId).pipe(
                tap((result) => {
                    this.setContent(result);
                }),
                catchError((err) => {
                    this.alerts.error(`Something went wrong!`);
                    return throwError(err);
                }),
            );
        } else {
            return this.network.fetchOne(id).pipe(
                tap((result) => {
                    this.setContent(result);
                }),
                catchError((err) => {
                    this.alerts.error(`Something went wrong!`);
                    return throwError(err);
                }),
            );
        }
    }

    //#endregion

    //#region ---CRUD OPERATIONS---

    public createWork(kind: ContentKind, formInfo: FormType) {
        return this.network.createContent(this.pseudQuery.currentId, kind, formInfo);
    }

    public save(contentId: string, kind: ContentKind, formInfo: FormType) {
        return this.network.saveContent(this.pseudQuery.currentId, contentId, kind, formInfo).pipe(
            tap((result: ContentModel) => {
                this.workStore.update({
                    content: result,
                });
                this.alerts.success(`Changes saved!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public delete(contentId: string) {
        return this.network.deleteOne(this.pseudQuery.currentId, contentId).pipe(
            tap(() => {
                this.workStore.update({
                    content: null,
                    ratings: null,
                });
                this.router.navigate(['/']).catch((err) => console.log(err));
                this.alerts.success(`Content successfully deleted!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public publish(contentId: string) {
        if (this.workQuery.contentKind !== ContentKind.PoetryContent && this.workQuery.wordCount < MIN_PROSE_LENGTH) {
            this.alerts.error(`Works other than poetry need a minimum of ${MIN_PROSE_LENGTH} words before you can submit.`);
            return of(null).pipe(take(1));
        }

        return this.network.publishOne(this.pseudQuery.currentId, contentId).pipe(
            tap((result: ContentModel) => {
                this.workStore.update({
                    content: result,
                });
                this.alerts.success(`Changes saved!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error.message);
                return throwError(() => err);
            }),
        );
    }

    public uploadCoverArt(uploader: FileUploader) {
        return this.network.changeImage(uploader).pipe(
            tap((result: ContentModel) => {
                this.workStore.update({
                    content: result,
                });
                this.alerts.success(`Changes saved!`);
            }),
            catchError((err) => {
                this.alerts.error(`Something went wrong! Try again in a little bit.`);
                return throwError(() => err);
            }),
        );
    }

    public updateWordCount(section: Section, pubStatus: PublishSection) {
        if (section.published === true && pubStatus.oldPub === false) {
            // if newly published
            this.workStore.update({
                wordCount: this.workQuery.wordCount + section.stats.words,
            });
        } else if (section.published === false && pubStatus.oldPub === true) {
            // if unpublished
            if (this.workQuery.wordCount !== 0) {
                this.workStore.update({
                    wordCount: this.workQuery.wordCount - section.stats.words,
                });
            }
        }
    }

    //#endregion

    //#region ---RATINGS---

    public addLike(contentId: string): void {
        switch (this.workQuery.currRating) {
            case RatingOption.Liked:
                this.alerts.error(`You've already upvoted this content!`);
                return;
            case RatingOption.Disliked:
                this.workStore.update({
                    selectedRating: RatingOption.Liked,
                    likes: this.workQuery.likes + 1,
                    dislikes: this.workQuery.dislikes - 1,
                });
                break;
            case RatingOption.NoVote:
                this.workStore.update({
                    selectedRating: RatingOption.Liked,
                    likes: this.workQuery.likes + 1,
                });
                break;
        }

        this.network.addLike(contentId).subscribe((val) => {
            this.workStore.update({
                ratings: val,
                selectedRating: val.rating,
            });
        });
    }

    public addDislike(contentId: string): void {
        switch (this.workQuery.currRating) {
            case RatingOption.Disliked:
                this.alerts.error(`You've already downvoted this content!`);
                return;
            case RatingOption.Liked:
                this.workStore.update({
                    selectedRating: RatingOption.Disliked,
                    likes: this.workQuery.likes - 1,
                    dislikes: this.workQuery.dislikes + 1,
                });
                break;
            case RatingOption.NoVote:
                this.workStore.update({
                    selectedRating: RatingOption.Disliked,
                    dislikes: this.workQuery.dislikes + 1,
                });
                break;
        }

        this.network.addDislike(contentId).subscribe((val) => {
            this.workStore.update({
                ratings: val,
                selectedRating: val.rating,
            });
        });
    }

    public setNoVote(contentId: string): void {
        switch (this.workQuery.currRating) {
            case RatingOption.Liked:
                this.workStore.update({
                    selectedRating: RatingOption.NoVote,
                    likes: this.workQuery.likes - 1,
                });
                break;
            case RatingOption.Disliked:
                this.workStore.update({
                    selectedRating: RatingOption.NoVote,
                    dislikes: this.workQuery.dislikes - 1,
                });
                break;
        }

        this.network.removeVote(contentId).subscribe((val) => {
            this.workStore.update({
                ratings: val,
                selectedRating: val.rating,
            });
        });
    }

    public addToLibrary(contentId: string) {
        return this.library.addToLibrary(contentId).pipe(
            tap((val) => {
                this.workStore.update({
                    libraryDoc: val,
                });
            }),
        );
    }

    public removeFromLibrary(contentId: string) {
        return this.library.removeFromLibrary(contentId).pipe(
            tap(() => {
                this.workStore.update({
                    libraryDoc: null,
                });
            }),
        );
    }

    //#endregion

    //#region ---PRIVATE---

    private setContent(result: PubContent) {
        this.workStore.update({
            content: result.content,
            ratings: result.ratings,
            selectedRating: result.ratings !== null ? result.ratings.rating : null,
            libraryDoc: result.libraryDoc !== null ? result.libraryDoc : null,
            wordCount: result.content.stats.words,
        });
        this.sections.setSections((result.content as any).sections);
    }

    //#endregion
}
