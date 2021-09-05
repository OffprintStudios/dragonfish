import { Controller, UseGuards, Patch, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards';
import { DragonfishTags } from '@dragonfish/shared/models/util';
import { ChangeEmail, ChangePassword, Roles } from '@dragonfish/shared/models/accounts';
import { User } from '@dragonfish/api/utilities/decorators';
import { JwtPayload } from '@dragonfish/shared/models/auth';

@Controller('account')
export class AccountController {
    constructor() {}

    @ApiTags(DragonfishTags.Users)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-email')
    async changeEmail(@User() user: JwtPayload, @Body() changeEmailRequest: ChangeEmail) {
        // TODO: handle email changes
    }

    @ApiTags(DragonfishTags.Users)
    @UseGuards(RolesGuard([Roles.User]))
    @Patch('change-password')
    async changePassword(@User() user: JwtPayload, @Body() newPassword: ChangePassword) {
        // TODO: handle password changes
    }
}
