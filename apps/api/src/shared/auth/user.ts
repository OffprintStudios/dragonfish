import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './jwt-payload';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user as JwtPayload;
});
