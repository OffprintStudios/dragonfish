import { Test, TestingModule } from '@nestjs/testing';
import { ProseStore } from './prose.store';

describe('ProseStore', () => {
    let service: ProseStore;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProseStore],
        }).compile();

        service = module.get<ProseStore>(ProseStore);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
