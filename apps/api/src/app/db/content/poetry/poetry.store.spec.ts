import { Test, TestingModule } from '@nestjs/testing';
import { PoetryStore } from './poetry.store';

describe('PoetryStore', () => {
    let service: PoetryStore;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PoetryStore],
        }).compile();

        service = module.get<PoetryStore>(PoetryStore);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
