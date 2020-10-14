import { Body, Controller, Request, Get, Param, Patch, Post, UseGuards, BadRequestException } from '@nestjs/common';
import { Roles } from '@pulp-fiction/models/users';
import { Decision } from '@pulp-fiction/models/contrib';
import { RolesGuard } from '../../../guards';
import { ApprovalQueueService } from '../../../db/approval-queue/approval-queue.service';
import { WorksService } from '../../../db/works/works.service';

@Controller('queue')
export class QueueController {
        constructor(private readonly approvalQueueService: ApprovalQueueService, private readonly worksService: WorksService) {}

        @UseGuards(RolesGuard([Roles.User]))
        @Post('submit-work/:workId')
        async submitWork(@Request() req: any, @Param('workId') workId: string) {
            const work = await this.worksService.findOneWorkById(workId);
            let publishedSections = work.sections.filter(x => x.published);
            if (!publishedSections || publishedSections.length < 1) {
                throw new BadRequestException("Your work must contain at least one published section before it can be submitted.");
            }
            return await this.approvalQueueService.addOneWork(req.user, workId);
        }
    
        @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
        @Get('get-queue/:pageNum')
        async getQueue(@Param('pageNum') pageNum: number) {
            return await this.approvalQueueService.fetchAll(pageNum);
        }
    
        @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
        @Get('get-queue-for-mod/:pageNum')
        async getQueueForMod(@Request() req: any, @Param('pageNum') pageNum: number) {
            return await this.approvalQueueService.fetchForMod(req.user, pageNum);
        }
    
        @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
        @Patch('claim-work/:docId')
        async claimWork(@Request() req: any, @Param('docId') docId: string) {
            return await this.approvalQueueService.claimWork(req.user, docId);
        }
    
        @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
        @Patch('approve-work')
        async approveWork(@Request() req: any, @Body() decision: Decision) {
            return await this.approvalQueueService.approveWork(req.user, decision.docId, decision.workId, decision.authorId);
        }
    
        @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
        @Patch('reject-work')
        async rejectWork(@Request() req: any, @Body() decision: Decision) {
            return await this.approvalQueueService.rejectWork(req.user, decision.docId, decision.workId, decision.authorId);
        }
}
