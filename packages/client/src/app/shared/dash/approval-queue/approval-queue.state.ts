import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { append, patch, removeItem } from '@ngxs/store/operators';

import { ApprovalQueue } from '@dragonfish/models/approval-queue';
import { PaginateResult } from '@dragonfish/models/util';
import { FrontendUser } from '@dragonfish/models/users';
import { PoetryContent, ProseContent, SectionInfo } from '@dragonfish/models/content';
import { Section } from '@dragonfish/models/sections';

import { AQNamespace } from './approval-queue.actions';
import { ApprovalQueueStateModel } from './approval-queue-state.model';
import { UserState } from '../../user';
import { NetworkService } from '../../../services';
import { AlertsService } from '@dragonfish/alerts';

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
    constructor(private networkService: NetworkService, private store: Store, private alerts: AlertsService) {}

    /* Actions */

    @Action(AQNamespace.GetQueue)
    getQueue(
        { patchState, dispatch }: StateContext<ApprovalQueueStateModel>,
        { pageNum }: AQNamespace.GetQueue,
    ): Observable<PaginateResult<ApprovalQueue>> {
        return this.networkService.fetchApprovalQueue(pageNum).pipe(
            tap((result: PaginateResult<ApprovalQueue>) => {
                const currUser: FrontendUser | null = this.store.selectSnapshot(UserState.currUser);
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
        return this.networkService.claimWork(doc._id).pipe(
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
        return this.networkService.fetchSection(sectionId).pipe(
            tap((val: Section) => {
                patchState({
                    selectedDocSection: val,
                });
            }),
        );
    }

    @Action(AQNamespace.ApproveWork)
    approveWork({ setState }: StateContext<ApprovalQueueStateModel>, { decision }: AQNamespace.ApproveWork) {
        return this.networkService.approveWork(decision).pipe(
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
        return this.networkService.rejectWork(decision).pipe(
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
}
