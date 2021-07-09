import { Test, TestingModule } from '@nestjs/testing';
import { CollectionsStore } from './collections.store';

describe('CollectionsStore', () => {
    let service: CollectionsStore;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CollectionsStore],
        }).compile();

        service = module.get<CollectionsStore>(CollectionsStore);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
