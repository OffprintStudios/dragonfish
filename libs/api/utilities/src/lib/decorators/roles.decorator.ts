import { SetMetadata } from '@nestjs/common';
import { Roles } from '@dragonfish/shared/models/accounts';

export const RolesDecorator = (...roles: Roles[]) => SetMetadata('roles', roles);
