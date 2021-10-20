import { SetMetadata } from '@nestjs/common';
import { Roles } from '@dragonfish/shared/models/accounts';

export const Identity = (...roles: Roles[]) => SetMetadata('identity', roles);
