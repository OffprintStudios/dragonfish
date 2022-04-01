import { SetMetadata } from '@nestjs/common';
import { Roles } from '$shared/models/accounts';

export const Identity = (...roles: Roles[]) => SetMetadata('identity', roles);
