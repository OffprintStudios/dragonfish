import { Test, TestingModule } from '@nestjs/testing';
import { BrowseService } from './browse.service';

describe('BrowseService', () => {
  let service: BrowseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrowseService],
    }).compile();

    service = module.get<BrowseService>(BrowseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
