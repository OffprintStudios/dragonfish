import { Test, TestingModule } from '@nestjs/testing';
import { ContentFoldersService } from './content-folders.service';

describe('ContentFoldersService', () => {
  let service: ContentFoldersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentFoldersService],
    }).compile();

    service = module.get<ContentFoldersService>(ContentFoldersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
