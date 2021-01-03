import { Controller, Get, Param } from '@nestjs/common';

import { UsersService } from '../../../db/users/users.service';

@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly usersService: UsersService) {}

    @Get('get-user-info/:userId')
    async getUserInfo(@Param('userId') userId: string) {
        return await this.usersService.getOneUser(userId);
    }
}
