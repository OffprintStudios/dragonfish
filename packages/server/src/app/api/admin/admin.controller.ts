import { Controller, Get } from '@nestjs/common';
import { FrontendUser } from '@pulp-fiction/models/users';
import { UsersService } from '../../db/users/users.service';

@Controller()
export class AdminController {
    constructor(private usersService: UsersService) {}

    @Get('site-staff')
    async getSiteStaff(): Promise<FrontendUser[]> {
        return await this.usersService.getSiteStaff();
    }

    @Get('supporters')
    async getSupporters(): Promise<FrontendUser[]> {
        return await this.usersService.getSupporters();
    }
}