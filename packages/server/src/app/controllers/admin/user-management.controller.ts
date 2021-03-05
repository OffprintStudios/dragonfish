import { InviteCodes, Roles } from '@dragonfish/models/users';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersStore } from '../../db/users/users.store';
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
