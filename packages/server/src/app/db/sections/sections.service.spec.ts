import { Test, TestingModule } from '@nestjs/testing';
import { SectionsService } from './sections.service';

describe('SectionsService', () => {
    let service: SectionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SectionsService],
        }).compile();

        service = module.get<SectionsService>(SectionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
