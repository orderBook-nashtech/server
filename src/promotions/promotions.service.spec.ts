import { Test, TestingModule } from '@nestjs/testing';
import { PromotionService } from './promotions.service';

describe('PromotionsService', () => {
  let service: PromotionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionService],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
