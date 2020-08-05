import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { WorksService } from '../works/works.service';

@Injectable()
export class ContribService {
    constructor(private usersService: UsersService, private worksService: WorksService) {}

    
}
