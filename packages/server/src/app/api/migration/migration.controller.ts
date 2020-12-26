import { Controller } from '@nestjs/common';
import { MigrationService } from './migration.service';

@Controller()
export class MigrationController {
    constructor (private readonly migrationService: MigrationService) {}
}