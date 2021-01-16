import { Controller, Get, Post, UseGuards, Request, NotFoundException, InternalServerErrorException, HttpCode, BadRequestException } from '@nestjs/common';

import { MarkReadRequest, NotificationBase, NotificationKind, NotificationSubscription } from '@pulp-fiction/models/notifications';
import { Roles } from '@pulp-fiction/models/users';
import { NotificationsService } from '../../db/notifications/notifications.service';
import { UnsubscribeResult } from '../../db/notifications/unsubscribe-result.model';
import { RolesGuard } from '../../guards';


@Controller()
export class NotificationController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get('getNotifications')
    @UseGuards(RolesGuard([Roles.User]))
    async getNotifications(@Request() req: any): Promise<NotificationBase[]> {
        const userId: string = req.user.sub;
        return await this.notificationsService.getAllNotifications(userId);
    }

    @Get('getUnreadNotifications')
    @UseGuards(RolesGuard([Roles.User]))
    async getUnreadNotifications(@Request() req: any): Promise<NotificationBase[]> {
        const userId: string = req.user.sub;
        return await this.notificationsService.getUnreadNotifications(userId);
    }

    @Post('markAsRead')
    @UseGuards(RolesGuard([Roles.User]))
    async markAsRead(@Request() req: any, toMark: MarkReadRequest): Promise<void> {
        const userId: string = req.user.sub;
        if (!toMark.ids) {
            throw new BadRequestException(undefined, "The 'ids' field of the request body must not be null.");
        }
        if (toMark.ids.length === 0) {
            throw new BadRequestException(undefined, "The 'ids' field of the reuqest body must contain at least one ID.");
        }
        await this.notificationsService.markAsRead(userId, toMark.ids);
    }

    @Get('getSubscriptions')
    @UseGuards(RolesGuard([Roles.User]))
    async getSubscriptions(@Request() req: any): Promise<NotificationSubscription[]> {
        const userId: string = req.user.sub;
        return await this.notificationsService.getSubscriptions(userId);
    }

    @Post('subscribe')
    @UseGuards(RolesGuard([Roles.User]))
    async subscribe(@Request() req: any, sourceId: string, sourceKind: NotificationKind): Promise<void> {
        const userId: string = req.user.sub;
        await this.notificationsService.subscribe(userId, sourceId, sourceKind);
    }

    @Post('unsubscribe')
    @HttpCode(200) // because a successful unsubscribe doesn't "create" anything, don't return Created
    @UseGuards(RolesGuard([Roles.User]))
    async unsubscribe(@Request() req: any, sourceId: string, sourceKind: NotificationKind): Promise<void> {
        const userId: string = req.user.sub;
        const result: UnsubscribeResult = await this.notificationsService.unsubscribe(userId, sourceId, sourceKind);
        if (result === UnsubscribeResult.NotFound) {
            throw new NotFoundException(undefined, "No subscription with those details found.");
        } else if (result === UnsubscribeResult.Failure) {
            throw new InternalServerErrorException();
        }        
    }
}
