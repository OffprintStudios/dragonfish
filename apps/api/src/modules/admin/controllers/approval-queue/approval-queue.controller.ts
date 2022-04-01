import { Controller, UseGuards, Get, Patch, Query, Body } from '@nestjs/common';
import { ApprovalQueueService } from '../../services';
import { Identity } from '$shared/auth';
import { IdentityGuard } from '$shared/guards';
import { Roles } from '$shared/models/accounts';
import type { Decision } from '$shared/models/admin/approval-queue';

@Controller('approval-queue')
export class ApprovalQueueController {
    constructor(private readonly queue: ApprovalQueueService) {}

    @UseGuards(IdentityGuard)
    @Identity(Roles.WorkApprover, Roles.Moderator, Roles.Admin)
    @Get('get-queue')
    async getQueue() {
        return await this.queue.fetchQueue();
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.WorkApprover, Roles.Moderator, Roles.Admin)
    @Patch('claim-content')
    async claimContent(@Query('pseudId') pseudId: string, @Query('docId') docId: string) {
        return await this.queue.claimDoc(docId, pseudId);
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.WorkApprover, Roles.Moderator, Roles.Admin)
    @Patch('approve-content')
    async approveContent(@Query('pseudId') pseudId: string, @Body() decision: Decision) {
        return await this.queue.approveWork(
            decision.docId,
            pseudId,
            decision.workId,
            decision.authorId,
        );
    }

    @UseGuards(IdentityGuard)
    @Identity(Roles.WorkApprover, Roles.Moderator, Roles.Admin)
    @Patch('reject-content')
    async rejectContent(@Query('pseudId') pseudId: string, @Body() decision: Decision) {
        return await this.queue.rejectWork(
            decision.docId,
            pseudId,
            decision.workId,
            decision.authorId,
        );
    }
}
