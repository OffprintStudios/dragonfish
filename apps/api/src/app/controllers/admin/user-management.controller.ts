import { InviteCodes, Roles } from '@dragonfish/shared/models/users';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersStore } from '@dragonfish/api/database/users';
import { RolesGuard } from '../../guards';

@Controller('user-management')
export class UserManagementController {
    constructor(private readonly users: UsersStore) {}

    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Get('generate-code')
    async generateCode(): Promise<InviteCodes> {
        return await this.users.generateInviteCode();
    }
}
