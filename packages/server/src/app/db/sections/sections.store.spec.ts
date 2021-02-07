import { Test, TestingModule } from '@nestjs/testing';
import { SectionsStore } from './sections.store';

describe('SectionsStore', () => {
    let service: SectionsStore;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SectionsStore],
        }).compile();

        service = module.get<SectionsStore>(SectionsStore);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
