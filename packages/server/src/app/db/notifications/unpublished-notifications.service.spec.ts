import { Test, TestingModule } from '@nestjs/testing';
import { UnpublishedNotificationsService } from './unpublished-notifications.service';

describe('UnpublishedNotificationsService', () => {
  let service: UnpublishedNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnpublishedNotificationsService],
    }).compile();

    service = module.get<UnpublishedNotificationsService>(UnpublishedNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
