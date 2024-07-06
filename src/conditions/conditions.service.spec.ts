import { Test, TestingModule } from '@nestjs/testing';
import { ConditionService } from './conditions.service';

describe('ConditionsService', () => {
  let service: ConditionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConditionService],
    }).compile();

    service = module.get<ConditionService>(ConditionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
