import { Controller, UseGuards, Request, Get } from '@nestjs/common';

import { ContribService } from './contrib.service';
import { Roles } from 'src/db/users/models';
import { RolesGuard } from 'src/guards';

@Controller()
export class ContribController {
    constructor(private readonly contribService: ContribService) {}

    @UseGuards(RolesGuard([Roles.User]))
    @Get('roles')
    async getRoles(@Request() req: any) {
        return await this.contribService.checkRoles(req.user);
    }
}
