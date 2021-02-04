import { Body, Controller, Request, Get, Param, Patch, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { Roles } from '@dragonfish/models/users';
import { Decision } from '@dragonfish/models/contrib';
import { RolesGuard } from '../../../guards';
import { QueueService } from './queue.service';
import { ContentKind } from '@dragonfish/models/content';
import { isNullOrUndefined } from '../../../util';

@Controller('queue')
export class QueueController {
    constructor(private readonly queueService: QueueService) {}

    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Get('get-queue/:pageNum')
    async getQueue(@Param('pageNum') pageNum: number) {
        return await this.queueService.getQueue(pageNum);
    }

    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Get('get-queue-for-mod/:pageNum')
    async getQueueForMod(@Request() req: any, @Param('pageNum') pageNum: number) {
        return await this.queueService.getQueueForMod(req.user, pageNum);
    }

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

        return await this.queueService.fetchOne(contentId, kind, userId);
    }

    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Patch('claim-work/:docId')
    async claimWork(@Request() req: any, @Param('docId') docId: string) {
        return await this.queueService.claimWork(req.user, docId);
    }

    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Patch('approve-work')
    async approveWork(@Request() req: any, @Body() decision: Decision) {
        return await this.queueService.approveWork(req.user, decision.docId, decision.workId, decision.authorId);
    }

    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Patch('reject-work')
    async rejectWork(@Request() req: any, @Body() decision: Decision) {
        return await this.queueService.rejectWork(req.user, decision.docId, decision.workId, decision.authorId);
    }
}
