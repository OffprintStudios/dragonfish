import { Controller, Get } from '@nestjs/common';
import { SetCookies } from '@nestjsplus/cookies';

@Controller()
export class AppController {
    @SetCookies()
    @Get('init')
    async init() {
        return { message: 'Initializing cookies...' };
    }
}