import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalQueueService } from './approval-queue.service';

describe('ApprovalQueueService', () => {
    let service: ApprovalQueueService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ApprovalQueueService],
        }).compile();

        service = module.get<ApprovalQueueService>(ApprovalQueueService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
