import { Injectable } from '@nestjs/common';

import { UsersService } from '../../db/users/users.service';
import { WorksService } from '../../db/works/works.service';
import { JwtPayload } from '../auth/models';

@Injectable()
export class ContribService {
    constructor(private usersService: UsersService, private worksService: WorksService) {}

    async checkRoles(user: JwtPayload) {
        console.log(user.roles);
    }
}
