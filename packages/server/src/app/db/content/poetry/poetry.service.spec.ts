import { Test, TestingModule } from '@nestjs/testing';
import { PoetryService } from './poetry.service';

describe('PoetryService', () => {
    let service: PoetryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PoetryService],
        }).compile();

        service = module.get<PoetryService>(PoetryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
