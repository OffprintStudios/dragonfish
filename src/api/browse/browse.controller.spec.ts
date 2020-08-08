import { Test, TestingModule } from '@nestjs/testing';
import { BrowseController } from './browse.controller';

describe('Browse Controller', () => {
  let controller: BrowseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrowseController],
    }).compile();

    controller = module.get<BrowseController>(BrowseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
