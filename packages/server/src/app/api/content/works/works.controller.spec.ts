import { Test, TestingModule } from '@nestjs/testing';
import { WorksController } from './works.controller';

describe('Works Controller', () => {
  let controller: WorksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorksController],
    }).compile();

    controller = module.get<WorksController>(WorksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
