import { Injectable } from '@angular/core';
import { SectionsStore } from './sections.store';
import { SectionsQuery } from './sections.query';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { PublishSection, Section, SectionForm } from '@dragonfish/shared/models/sections';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SectionsService {
    constructor(
        private sectionsStore: SectionsStore,
        private sectionsQuery: SectionsQuery,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
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
        return this.network.createSection(contentId, sectionInfo).pipe(
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
        return this.network.editSection(contentId, sectionId, sectionInfo).pipe(
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
        return this.network.publishSection(contentId, sectionId, pubStatus).pipe(
            tap((result: Section) => {
                this.sectionsStore.update(sectionId, result);
                //this.stuff.updateWordCount(result, pubStatus);
            }),
            catchError((err) => {
                this.alerts.error(err.error);
                return throwError(err);
            }),
        );
    }

    public delete(contentId: string, sectionId: string) {
        return this.network.deleteSection(contentId, sectionId).pipe(
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
}
