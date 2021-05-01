import { Test, TestingModule } from '@nestjs/testing';
import { CommentsStore } from './comments.store';

describe('CommentsStore', () => {
    let service: CommentsStore;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CommentsStore],
        }).compile();

        service = module.get<CommentsStore>(CommentsStore);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
