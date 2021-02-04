import { Test, TestingModule } from '@nestjs/testing';
import { DocsService } from './docs.service';

describe('DocsService', () => {
    let service: DocsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DocsService],
        }).compile();

        service = module.get<DocsService>(DocsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
