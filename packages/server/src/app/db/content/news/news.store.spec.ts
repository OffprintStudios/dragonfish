import { Test, TestingModule } from '@nestjs/testing';
import { NewsStore } from './news.store';

describe('NewsStore', () => {
    let service: NewsStore;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [NewsStore],
        }).compile();

        service = module.get<NewsStore>(NewsStore);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
