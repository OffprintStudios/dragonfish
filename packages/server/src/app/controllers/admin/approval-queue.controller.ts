import { Body, Controller, Request, Get, Param, Patch, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../../guards';
import { isNullOrUndefined } from '../../util';
import { ContentKind } from '@dragonfish/models/content';
import { Roles } from '@dragonfish/models/users';
import { Decision } from '@dragonfish/models/contrib';
import { IApprovalQueue } from '../../shared/admin/approval-queue.interface';

@Controller('approval-queue')
export class ApprovalQueueController {
    constructor(private readonly queue: IApprovalQueue) {}

    @ApiTags('approval-queue')
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Get('get-queue/:pageNum')
    async getQueue(@Param('pageNum') pageNum: number) {
        return await this.queue.getQueue(pageNum);
    }

    @ApiTags('approval-queue')
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Get('view-content')
    async viewContent(
        @Request() _req: any,
        @Query('contentId') contentId: string,
        @Query('kind') kind: ContentKind,
        @Query('userId') userId: string,
    ) {
        if (isNullOrUndefined(contentId) || isNullOrUndefined(kind) || isNullOrUndefined(userId)) {
            throw new BadRequestException(
                `This request requires the content ID, content kind, and userId of the content you're looking for.`,
            );
        }

        return await this.queue.viewContent(contentId, kind, userId);
    }

    @ApiTags('approval-queue')
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Patch('claim-content/:docId')
    async claimContent(@Request() req: any, @Param('docId') docId: string) {
        return await this.queue.claimContent(req.user, docId);
    }

    @ApiTags('approval-queue')
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Patch('approve-content')
    async approveContent(@Request() req: any, @Body() decision: Decision) {
        return await this.queue.approveContent(req.user, decision.docId, decision.workId, decision.authorId);
    }

    @ApiTags('approval-queue')
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Patch('reject-content')
    async rejectContent(@Request() req: any, @Body() decision: Decision) {
        return await this.queue.rejectContent(req.user, decision.docId, decision.workId, decision.authorId);
    }
}
