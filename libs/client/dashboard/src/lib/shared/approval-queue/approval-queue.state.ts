import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { append, patch, removeItem } from '@ngxs/store/operators';

import { ApprovalQueue } from '@dragonfish/shared/models/approval-queue';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { PoetryContent, ProseContent, SectionInfo } from '@dragonfish/shared/models/content';
import { Section } from '@dragonfish/shared/models/sections';

import { AQNamespace } from './approval-queue.actions';
import { ApprovalQueueStateModel } from './approval-queue-state.model';
import { ApprovalQueueService } from './services';
import { AlertsService } from '@dragonfish/client/alerts';

@State<ApprovalQueueStateModel>({
    name: 'approvalQueue',
    defaults: {
        currPageDocs: null,
        claimedDocs: [],
        selectedDoc: null,
        selectedDocSections: null,
        selectedDocSection: null,
    },
})
@Injectable()
export class ApprovalQueueState {
    /* Selectors */
    @Selector()
    static currPageDocs(state: ApprovalQueueStateModel): PaginateResult<ApprovalQueue> | null {
        return state.currPageDocs;
    }

    @Selector()
    static claimedDocs(state: ApprovalQueueStateModel): ApprovalQueue[] {
        return state.claimedDocs;
    }

    @Selector()
    static selectedDoc(state: ApprovalQueueStateModel): ApprovalQueue | null {
        return state.selectedDoc;
    }

    @Selector()
    static selectedDocSections(state: ApprovalQueueStateModel): SectionInfo[] | null {
        return state.selectedDocSections;
    }

    @Selector()
    static selectedDocSection(state: ApprovalQueueStateModel): Section | null {
        return state.selectedDocSection;
    }

    constructor(private queue: ApprovalQueueService, private alerts: AlertsService) {}

    /* Actions */
    @Action(AQNamespace.GetQueue)
    getQueue(
        { patchState }: StateContext<ApprovalQueueStateModel>,
        { pageNum }: AQNamespace.GetQueue,
    ): Observable<PaginateResult<ApprovalQueue>> {
        return this.queue.getQueue(pageNum).pipe(
            tap((result: PaginateResult<ApprovalQueue>) => {
                const currUser: FrontendUser | null = JSON.parse(localStorage.getItem('user')).currUser;
                if (currUser !== null) {
                    // current behavior will reset the `claimedDocs` every time the page changes; this will be addressed
                    // in a future update to determine if docs have already been added to the array
                    const ownedDocs = result.docs.filter((doc: any) => {
                        return doc.claimedBy !== null && doc.claimedBy._id === currUser._id;
                    });
                    patchState({
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

    @Action(AQNamespace.GetQueueForMod)
    getQueueForMod({ dispatch }: StateContext<ApprovalQueueStateModel>, _action: AQNamespace.GetQueueForMod) {
        this.alerts.info(`Action not yet supported.`);
    }

    @Action(AQNamespace.ClaimWork)
    claimWork(
        { setState }: StateContext<ApprovalQueueStateModel>,
        { doc }: AQNamespace.ClaimWork,
    ): Observable<ApprovalQueue> {
        return this.queue.claimWork(doc._id).pipe(
            tap((result: ApprovalQueue) => {
                setState(
                    patch({
                        claimedDocs: append([result]),
                    }),
                );
            }),
        );
    }

    @Action(AQNamespace.SelectWork)
    selectWork({ patchState }: StateContext<ApprovalQueueStateModel>, { doc }: AQNamespace.SelectWork): void {
        const work = doc.workToApprove as ProseContent | PoetryContent;
        patchState({
            selectedDoc: doc,
            selectedDocSections: work.sections as SectionInfo[],
        });
    }

    @Action(AQNamespace.FetchSection)
    fetchSection({ patchState }: StateContext<ApprovalQueueStateModel>, { sectionId }: AQNamespace.FetchSection) {
        return this.queue.fetchSection(sectionId).pipe(
            tap((val: Section) => {
                patchState({
                    selectedDocSection: val,
                });
            }),
        );
    }

    @Action(AQNamespace.ApproveWork)
    approveWork({ setState }: StateContext<ApprovalQueueStateModel>, { decision }: AQNamespace.ApproveWork) {
        return this.queue.approveWork(decision).pipe(
            tap((_result: void) => {
                setState(
                    patch({
                        claimedDocs: removeItem<ApprovalQueue>((doc) => doc._id === decision.docId),
                        selectedDoc: null,
                    }),
                );
            }),
        );
    }

    @Action(AQNamespace.RejectWork)
    rejectWork({ setState }: StateContext<ApprovalQueueStateModel>, { decision }: AQNamespace.RejectWork) {
        return this.queue.rejectWork(decision).pipe(
            tap((_result: void) => {
                setState(
                    patch({
                        claimedDocs: removeItem<ApprovalQueue>((doc) => doc._id === decision.docId),
                        selectedDoc: null,
                    }),
                );
            }),
        );
    }

    @Action(AQNamespace.ViewContent)
    viewContent({ dispatch }: StateContext<ApprovalQueueStateModel>) {
        this.alerts.info(`Action not yet supported.`);
    }
}
