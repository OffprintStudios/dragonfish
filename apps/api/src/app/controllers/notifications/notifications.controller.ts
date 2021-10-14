import {
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    NotFoundException,
    InternalServerErrorException,
    HttpCode,
    BadRequestException,
    Sse,
    MessageEvent,
    Query,
    Body,
} from '@nestjs/common';

import {
    MarkReadRequest,
    NotificationBase,
    NotificationKind,
    NotificationSubscription,
} from '@dragonfish/shared/models/notifications';
import { Roles } from '@dragonfish/shared/models/users';
import { RolesGuard } from '../../guards';
import { isNullOrUndefined } from '@dragonfish/shared/functions';

@UseGuards(RolesGuard([Roles.User]))
@Controller('notifications')
export class NotificationsController {
    /*@Get('all-notifications')
    async getAllNotifications(@Request() req: any): Promise<NotificationBase[]> {
        const userId: string = req.user.sub;
        return await this.notificationsService.getAllNotifications(userId);
    }

    @Get('unread-notifications')
    async getUnreadNotifications(@Request() req: any): Promise<NotificationBase[]> {
        const userId: string = req.user.sub;
        return await this.notificationsService.getUnreadNotifications(userId);
    }

    @Post('mark-as-read')
    async markAsRead(@Request() req: any, @Body() toMark: MarkReadRequest): Promise<void> {
        const userId: string = req.user.sub;
        if (!toMark.ids) {
            throw new BadRequestException(undefined, "The 'ids' field of the request body must not be null.");
        }
        if (toMark.ids.length === 0) {
            throw new BadRequestException(
                undefined,
                "The 'ids' field of the reuqest body must contain at least one ID.",
            );
        }
        await this.notificationsService.markAsRead(userId, toMark.ids);
    }

    @Get('subscriptions')
    async getSubscriptions(@Request() req: any): Promise<NotificationSubscription[]> {
        const userId: string = req.user.sub;
        return await this.notificationsService.getSubscriptions(userId);
    }

    @Post('subscribe')
    async subscribe(
        @Request() req: any,
        @Query('sourceId') sourceId: string,
        @Query('sourceKind') sourceKind: NotificationKind,
    ): Promise<void> {
        if (isNullOrUndefined(sourceId)) {
            throw new BadRequestException(`This request must include the source ID.`);
        }

        const userId: string = req.user.sub;
        await this.notificationsService.subscribe(userId, sourceId, sourceKind);
    }

    @Post('unsubscribe')
    @HttpCode(200) // because a successful unsubscribe doesn't "create" anything, don't return Created
    async unsubscribe(
        @Request() req: any,
        @Query('sourceId') sourceId: string,
        @Query('sourceKind') sourceKind: NotificationKind,
    ): Promise<void> {
        if (isNullOrUndefined(sourceId)) {
            throw new BadRequestException(`This request must include the source ID.`);
        }

        const userId: string = req.user.sub;
        const result: UnsubscribeResult = await this.notificationsService.unsubscribe(userId, sourceId, sourceKind);
        if (result === UnsubscribeResult.NotFound) {
            throw new NotFoundException(undefined, 'No subscription with those details found.');
        } else if (result === UnsubscribeResult.Failure) {
            throw new InternalServerErrorException();
        }
    }*/
}
