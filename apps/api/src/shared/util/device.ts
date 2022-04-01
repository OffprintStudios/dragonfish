import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DeviceInfo } from './device-info';
import UAParser from 'ua-parser-js';

export const Device = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const userAgent = new UAParser(req.headers['user-agent']);
    const deviceInfo: DeviceInfo = {
        ipAddr: req.ip,
        os: `${userAgent.getOS().name} ${userAgent.getOS().version}`,
        browser: `${userAgent.getBrowser().name} ${userAgent.getBrowser().version}`,
    };

    return deviceInfo;
});
