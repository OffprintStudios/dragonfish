import { Injectable } from '@angular/core';
import { SectionsStore } from './sections.store';
import { SectionsQuery } from './sections.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { PublishSection, Section, SectionForm } from '@dragonfish/shared/models/sections';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PseudonymsQuery } from '../../pseudonyms';

@Injectable({ providedIn: 'root' })
export class SectionsService {
    constructor(
        private sectionsStore: SectionsStore,
        private sectionsQuery: SectionsQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
        private pseudQuery: PseudonymsQuery,
    ) {}

    public setSections(sections: Section[]) {
        this.sectionsStore.set(sections);
        this.sectionsStore.update({
            pubSecList: sections.filter((item) => {
                return item.published === true;
            }),
        });
    }

    public setActive(id: string) {
        this.sectionsStore.setActive(id);
    }

    //#region ---CRUD OPERATIONS---

    public create(contentId: string, sectionInfo: SectionForm) {
        return this.network.createSection(this.pseudQuery.currentId, contentId, sectionInfo).pipe(
            tap((result: Section) => {
                this.sectionsStore.add(result);
                this.alerts.success(`Section created!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error);
                return throwError(err);
            }),
        );
    }

    public save(contentId: string, sectionId: string, sectionInfo: SectionForm) {
        return this.network.editSection(this.pseudQuery.currentId, contentId, sectionId, sectionInfo).pipe(
            tap((result: Section) => {
                this.sectionsStore.update(sectionId, result);
                this.alerts.success(`Changes saved!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error);
                return throwError(err);
            }),
        );
    }

    public publish(contentId: string, sectionId: string, pubStatus: PublishSection) {
        return this.network.publishSection(this.pseudQuery.currentId, contentId, sectionId, pubStatus).pipe(
            tap((result: Section) => {
                this.sectionsStore.update(sectionId, result);
                location.reload();
                //this.worksService.updateWordCount(result, pubStatus);
            }),
            catchError((err) => {
                this.alerts.error(err.error);
                return throwError(err);
            }),
        );
    }

    public delete(contentId: string, sectionId: string) {
        return this.network.deleteSection(this.pseudQuery.currentId, contentId, sectionId).pipe(
            tap(() => {
                this.sectionsStore.remove(sectionId);
                this.sectionsStore.setActive(null);
                this.alerts.success(`Item successfully deleted!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error);
                return throwError(err);
            }),
        );
    }

    //#endregion

    //#region ---SECTION NAVIGATION---

    public goToSection(index: number) {
        const currSection = this.sectionsQuery.pubSections[index - 1];
        this.sectionsStore.setActive(currSection._id);
        this.sectionsStore.update({
            currIndex: index,
        });
    }

    //#endregion
}
