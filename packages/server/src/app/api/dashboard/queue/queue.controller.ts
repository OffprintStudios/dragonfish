import { Body, Controller, Request, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '@pulp-fiction/models/users';
import { Decision } from '@pulp-fiction/models/contrib';
import { RolesGuard } from '../../../guards';
import { ContribService } from '../../contrib/contrib.service';

@Controller('queue')
export class QueueController {
        constructor(private readonly contribService: ContribService) {}

        @UseGuards(RolesGuard([Roles.User]))
        @Post('submit-work/:workId')
        async submitWork(@Request() req: any, @Param('workId') workId: string) {
            return await this.contribService.submitWork(req.user, workId);
        }
    
        @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
        @Get('queue/:pageNum')
        async getQueue(@Param('pageNum') pageNum: number) {
            return await this.contribService.getQueue(pageNum);
        }
    
        @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
        @Get('queue-for-mod/:pageNum')
        async getQueueForMod(@Request() req: any, @Param('pageNum') pageNum: number) {
            return await this.contribService.getQueueForMod(req.user, pageNum);
        }
    
        @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
        @Patch('claim-work/:docId')
        async claimWork(@Request() req: any, @Param('docId') docId: string) {
            return await this.contribService.claimWork(req.user, docId);
        }
    
        @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
        @Patch('approve-work')
        async approveWork(@Request() req: any, @Body() decision: Decision) {
            return await this.contribService.approveWork(
                req.user,
                decision.docId,
                decision.workId,
                decision.authorId,
            );
        }
    
        @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
        @Patch('reject-work')
        async rejectWork(@Request() req: any, @Body() decision: Decision) {
            return await this.contribService.rejectWork(
                req.user,
                decision.docId,
                decision.workId,
                decision.authorId,
            );
        }
}
