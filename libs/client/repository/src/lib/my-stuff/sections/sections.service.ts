import { Injectable } from '@angular/core';
import { SectionsStore } from './sections.store';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PublishSection, Section, SectionForm } from '@dragonfish/shared/models/sections';
import { MyStuffService } from '@dragonfish/client/repository/my-stuff';

@Injectable({ providedIn: 'root' })
export class SectionsService {
    constructor(
        private sections: SectionsStore,
        private stuff: MyStuffService,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
    ) {}

    public setAll(contentId: string) {
        return this.network.fetchSections(contentId).pipe(
            tap((result: Section[]) => {
                this.sections.set(result);
            }),
            catchError(err => {
                this.alerts.error(`Something went wrong fetching your content!`);
                return throwError(err);
            }),
        );
    }

    public setActive(sectionId: string) {
        this.sections.setActive(sectionId);
    }

    public create(contentId: string, sectionInfo: SectionForm) {
        return this.network.createSection(contentId, sectionInfo).pipe(
            tap((result: Section) => {
                this.sections.add(result);
                this.sections.setActive(result._id);
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
                this.sections.update(sectionId, result);
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
                this.sections.update(sectionId, result);
                this.stuff.updateWordCount(result, pubStatus);
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
                this.sections.remove(sectionId);
                this.sections.setActive(null);
                this.alerts.success(`Item successfully deleted!`);
            }),
            catchError((err) => {
                this.alerts.error(err.error);
                return throwError(err);
            }),
        );
    }
}
