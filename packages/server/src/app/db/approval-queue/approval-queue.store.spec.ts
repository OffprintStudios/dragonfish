import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalQueueStore } from './approval-queue.store';

describe('ApprovalQueueStore', () => {
    let service: ApprovalQueueStore;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ApprovalQueueStore],
        }).compile();

        service = module.get<ApprovalQueueStore>(ApprovalQueueStore);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
