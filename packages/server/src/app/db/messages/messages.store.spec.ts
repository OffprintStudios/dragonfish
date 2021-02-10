import { Test, TestingModule } from '@nestjs/testing';
import { MessagesStore } from './messages.store';

describe('MessagesStore', () => {
    let service: MessagesStore;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MessagesStore],
        }).compile();

        service = module.get<MessagesStore>(MessagesStore);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
