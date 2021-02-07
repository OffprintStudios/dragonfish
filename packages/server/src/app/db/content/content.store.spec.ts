import { Test, TestingModule } from '@nestjs/testing';
import { ContentStore } from './content.store';

describe('ContentStore', () => {
    let service: ContentStore;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ContentStore],
        }).compile();

        service = module.get<ContentStore>(ContentStore);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
