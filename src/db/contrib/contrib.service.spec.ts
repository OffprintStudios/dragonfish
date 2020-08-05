import { Test, TestingModule } from '@nestjs/testing';
import { ContribService } from './contrib.service';

describe('ContribService', () => {
  let service: ContribService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContribService],
    }).compile();

    service = module.get<ContribService>(ContribService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
