import { Test, TestingModule } from '@nestjs/testing';
import { UsersStore } from './users.store';

describe('UsersStore', () => {
    let service: UsersStore;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersStore],
        }).compile();

        service = module.get<UsersStore>(UsersStore);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
