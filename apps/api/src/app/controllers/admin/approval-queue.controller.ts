import { Body, Controller, Get, Param, Patch, UseGuards, BadRequestException, Query, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IdentityGuard, RolesGuard } from '../../guards';
import { isNullOrUndefined } from '@dragonfish/shared/functions';
import { ContentKind } from '@dragonfish/shared/models/content';
import { Roles } from '@dragonfish/shared/models/accounts';
import { IApprovalQueue } from '../../shared/admin';
import { DecisionDTO } from './models';
import { User } from '@dragonfish/api/utilities/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';
import { DragonfishTags } from '@dragonfish/shared/models/util';

@Controller('approval-queue')
export class ApprovalQueueController {
    constructor(@Inject('IApprovalQueue') private readonly queue: IApprovalQueue) {}

    @ApiTags(DragonfishTags.ApprovalQueue)
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Get('get-queue/:pageNum')
    async getQueue(@Param('pageNum') pageNum: number) {
        return await this.queue.getQueue(pageNum);
    }

    @ApiTags(DragonfishTags.ApprovalQueue)
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Get('view-content')
    async viewContent(
        @User() _user: JwtPayload,
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

    @ApiTags(DragonfishTags.ApprovalQueue)
    @UseGuards(IdentityGuard([Roles.Admin, Roles.Moderator, Roles.WorkApprover]))
    @Patch('claim-content')
    async claimContent(@Query('pseudId') pseudId: string, @Query('docId') docId: string) {
        return await this.queue.claimContent(pseudId, docId);
    }

    @ApiTags(DragonfishTags.ApprovalQueue)
    @UseGuards(IdentityGuard([Roles.Admin, Roles.Moderator, Roles.WorkApprover]))
    @Patch('approve-content')
    async approveContent(@Query('pseudId') pseudId: string, @Body() decision: DecisionDTO) {
        return await this.queue.approveContent(pseudId, decision.docId, decision.workId, decision.authorId);
    }

    @ApiTags(DragonfishTags.ApprovalQueue)
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Patch('reject-content')
    async rejectContent(@Query('pseudId') pseudId: string, @Body() decision: DecisionDTO) {
        return await this.queue.rejectContent(pseudId, decision.docId, decision.workId, decision.authorId);
    }
}
