import { Body, Controller, Request, Get, Param, Patch, Post, UseGuards, BadRequestException } from '@nestjs/common';
import { Roles } from '@pulp-fiction/models/users';
import { Decision } from '@pulp-fiction/models/contrib';
import { RolesGuard } from '../../../guards';
import { QueueService } from './queue.service';
import { WorksService } from '../../../db/works/works.service';

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
