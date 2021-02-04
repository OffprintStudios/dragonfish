import { Test, TestingModule } from '@nestjs/testing';
import { ProseService } from './prose.service';

describe('ProseService', () => {
    let service: ProseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProseService],
        }).compile();

        service = module.get<ProseService>(ProseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
