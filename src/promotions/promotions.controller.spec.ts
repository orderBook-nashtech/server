import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from './promotions.service';
import { PromotionController } from './promotions.controller';

describe('PromotionsController', () => {
  let controller: PromotionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionController],
      providers: [PromotionService],
    }).compile();

    controller = module.get<PromotionController>(PromotionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
