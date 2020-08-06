import { Test, TestingModule } from '@nestjs/testing';
import { ContribController } from './contrib.controller';

describe('Contrib Controller', () => {
  let controller: ContribController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContribController],
    }).compile();

    controller = module.get<ContribController>(ContribController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
