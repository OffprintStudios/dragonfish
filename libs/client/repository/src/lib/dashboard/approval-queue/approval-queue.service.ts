import { Injectable } from '@angular/core';
import { ApprovalQueueQuery } from './approval-queue.query';
import { ApprovalQueueStore } from './approval-queue.store';
import { AlertsService } from '@dragonfish/client/alerts';
import { tap } from 'rxjs/operators';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { Decision } from '@dragonfish/shared/models/contrib';
import { PoetryContent, ProseContent, SectionInfo } from '@dragonfish/shared/models/content';

@Injectable({ providedIn: 'root' })
export class ApprovalQueueService {
    constructor(
        private queueQuery: ApprovalQueueQuery,
        private queueStore: ApprovalQueueStore,
        private network: DragonfishNetworkService,
        private alerts: AlertsService,
        private sessionQuery: SessionQuery,
    ) {}

    public getQueue(pageNum: number) {
        return this.network.getQueue(pageNum).pipe(
            tap((result) => {
                if (this.sessionQuery.currentUser !== null) {
                    // current behavior will reset the `claimedDocs` every time the page changes; this will be addressed
                    // in a future update to determine if docs have already been added to the array
                    const ownedDocs = result.docs.filter((doc: any) => {
                        return doc.claimedBy !== null && doc.claimedBy._id === this.sessionQuery.currentUser._id;
                    });
                    this.queueStore.update({
                        currPageDocs: result,
                        claimedDocs: ownedDocs,
                    });
                    return;
                } else {
                    this.alerts.error(`This action is forbidden.`);
                }
            }),
        );
    }

    public getQueueForMod() {
        this.alerts.info(`This action is not yet supported.`);
    }

    public claimWork(doc: ApprovalQueue) {
        return this.network.claimWork(doc._id).pipe(
            tap((result: ApprovalQueue) => {
                this.queueStore.update({
                    claimedDocs: [...this.queueStore.getValue().claimedDocs, result],
                });
            }),
        );
    }

    public approveWork(decision: Decision) {
        return this.network.approveWork(decision).pipe(
            tap(() => {
                this.queueStore.update({
                    claimedDocs: this.queueStore.getValue().claimedDocs.filter((val) => {
                        return val._id !== decision.docId;
                    }),
                });
            }),
        );
    }

    public rejectWork(decision: Decision) {
        return this.network.rejectWork(decision).pipe(
            tap(() => {
                this.queueStore.update({
                    claimedDocs: this.queueStore.getValue().claimedDocs.filter((val) => {
                        return val._id !== decision.docId;
                    }),
                });
            }),
        );
    }

    public selectWork(doc: ApprovalQueue) {
        const work = doc.workToApprove as ProseContent | PoetryContent;
        this.queueStore.update({
            selectedDoc: doc,
            selectedDocSections: work.sections as SectionInfo[],
        });
    }

    public fetchSection(sectionId: string) {
        return this.network.fetchSection(sectionId).pipe(
            tap((value) => {
                this.queueStore.update({
                    selectedDocSection: value,
                });
            }),
        );
    }

    public viewContent() {
        this.alerts.info(`This action is not yet supported.`);
    }
}
