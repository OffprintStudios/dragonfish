import { Controller, UseGuards, Request, Get } from '@nestjs/common';

import { ContribService } from './contrib.service';
import { AuthGuard } from 'src/guards';

@Controller()
export class ContribController {
    constructor(private readonly contribService: ContribService) {}

    @UseGuards(AuthGuard)
    @Get('roles')
    async getRoles(@Request() req: any) {
        return await this.contribService.checkRoles(req.user);
    }
}
