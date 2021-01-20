import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ProseContent, SectionInfo, WorkStatus } from '@pulp-fiction/models/content';
import { ApprovalQueue } from '@pulp-fiction/models/approval-queue';

@Component({
    selector: 'approve-prose',
    templateUrl: './approve-prose.component.html',
    styleUrls: ['./approve-prose.component.less']
})
export class ApproveProseComponent implements OnInit {
    currDoc: ApprovalQueue;
    currProse: ProseContent;
    contentStatus = WorkStatus;

    constructor(public route: ActivatedRoute) {}

    ngOnInit(): void {
        this.currDoc = cloneDeep(this.route.snapshot.data.contentData) as ApprovalQueue;
        this.currProse = cloneDeep(this.currDoc.workToApprove) as ProseContent;
        console.log(this.currProse);
    }

    /**
     * Old prose won't have a publishedOn value, so createdAt is used instead
     * @param section 
     */
    getPublishedDate(section: SectionInfo): Date {
        if (section.audit.publishedOn === null) {
            return section.createdAt;
        }
        return section.audit.publishedOn;
    }
}