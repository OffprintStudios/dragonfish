import { Test, TestingModule } from '@nestjs/testing';
import { BlogsStore } from './blogs.store';

describe('BlogsStore', () => {
    let service: BlogsStore;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BlogsStore],
        }).compile();

        service = module.get<BlogsStore>(BlogsStore);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
