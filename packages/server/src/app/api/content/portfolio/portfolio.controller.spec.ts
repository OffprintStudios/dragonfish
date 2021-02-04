import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioController } from './portfolio.controller';

describe('Portfolio Controller', () => {
    let controller: PortfolioController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PortfolioController],
        }).compile();

        controller = module.get<PortfolioController>(PortfolioController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
