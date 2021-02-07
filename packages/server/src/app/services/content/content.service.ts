import { Injectable, Logger } from '@nestjs/common';

import { ContentService as ContentServiceDb } from '../../db/content';

@Injectable()
export class ContentService {
    private readonly logger: Logger = new Logger(ContentService.name);

    constructor (private readonly content: ContentServiceDb) {}
}