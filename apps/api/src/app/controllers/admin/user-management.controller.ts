import { FandomTags, InviteCodes, Roles } from '@dragonfish/shared/models/users';
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
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
    
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Put('create-fandom-tag')
    async createFandomTag(@Body() fandomTagInfo: FandomTags): Promise<FandomTags> {
        return await this.users.createFandomTag(fandomTagInfo);
    }
    
    @UseGuards(RolesGuard([Roles.WorkApprover, Roles.Moderator, Roles.Admin]))
    @Get('fetch-all-fandom-tags')
    async fetchAllFandomTags(): Promise<FandomTags[]> {
        return await this.users.fetchAllFandomTags();
    }
}
