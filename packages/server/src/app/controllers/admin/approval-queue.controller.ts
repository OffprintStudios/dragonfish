import { Body, Controller, Get, Param, Patch, UseGuards, BadRequestException, Query, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../../guards';
import { isNullOrUndefined } from '../../util';
import { ContentKind } from '@dragonfish/models/content';
import { Roles } from '@dragonfish/models/users';
import { IApprovalQueue } from '../../shared/admin';
import { DecisionDTO } from './models';
import { User } from '../../util/decorators';
import { JwtPayload } from '@dragonfish/models/auth';

@Controller('approval-queue')
export class ApprovalQueueController {
    constructor(@Inject('IApprovalQueue') private readonly queue: IApprovalQueue) {}

    @ApiTags('Approval Queue')
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Get('get-queue/:pageNum')
    async getQueue(@Param('pageNum') pageNum: number) {
        return await this.queue.getQueue(pageNum);
    }

    @ApiTags('Approval Queue')
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

    @ApiTags('Approval Queue')
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Patch('claim-content/:docId')
    async claimContent(@User() user: JwtPayload, @Param('docId') docId: string) {
        return await this.queue.claimContent(user, docId);
    }

    @ApiTags('Approval Queue')
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Patch('approve-content')
    async approveContent(@User() user: JwtPayload, @Body() decision: DecisionDTO) {
        return await this.queue.approveContent(user, decision.docId, decision.workId, decision.authorId);
    }

    @ApiTags('Approval Queue')
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Patch('reject-content')
    async rejectContent(@User() user: JwtPayload, @Body() decision: DecisionDTO) {
        return await this.queue.rejectContent(user, decision.docId, decision.workId, decision.authorId);
    }
}
