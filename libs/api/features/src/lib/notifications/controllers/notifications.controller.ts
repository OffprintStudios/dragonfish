import { Controller, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@dragonfish/api/utilities/guards';
import { Roles } from '@dragonfish/shared/models/users';

@UseGuards(RolesGuard([Roles.User]))
@Controller('notifications')
export class NotificationsController {}
