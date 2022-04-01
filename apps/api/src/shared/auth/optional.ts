import { SetMetadata } from '@nestjs/common';

export const Optional = (optional: boolean) => SetMetadata('optional', optional);
