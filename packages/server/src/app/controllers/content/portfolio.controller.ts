import { Controller, Get, Inject, Param } from '@nestjs/common';
import { IUser } from '../../shared/auth';

@Controller('portfolio')
export class PortfolioController {
    constructor(@Inject('IUser') private readonly user: IUser) {}

    @Get('get-user-info/:userId')
    async getUserInfo(@Param('userId') userId: string) {
        return await this.user.getOneUser(userId);
    }
}
